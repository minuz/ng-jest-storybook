import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, filter, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { TreeComponentHelper } from './helpers/component.helper';
import { DataSourceHelper } from './helpers/datasource.helper';
import { debug } from './helpers/pipe.operators';
import {
  CanDrop,
  DropPosition,
  GetBranchFunction,
  GetChildrenFunction,
  GetRootFunction,
  IBranchDetails,
  ITreeNode,
  TransformFunction,
} from './models/treeview.models.interfaces';
import { TreeControl } from './treeview.control';
import { TreeviewDataSource } from './treeview.datasource';

/**
 * Tree view component is an abstraction of the `Material Tree Control`.
 * It wraps the component, apply css that is consistent with Workbench styling
 * and expose several methods to provide common functionality.
 * In addition, it follows the same design principal from `Material Tree Control`.
 *
 * @class TreeviewComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'wb-treeview',
  templateUrl: 'treeview.component.html',
  styleUrls: ['treeview.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class TreeviewComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Flag to determine whether the component should display debugging information on console.
   */
  @Input() enableDebug = false;

  /**
   * Flag to determine whether the component should use drag and drop
   */
  @Input() enableDragAndDrop = false;

  /**
   * Value in pixels to determine the indentation of children nodes in relation to its parent.
   */
  @Input() indent = 20;

  /**
   * Expression to customize the logic whether the node can be dropped or not.
   * Requires the property `enableDragAndDrop` to be true.
   */
  @Input() canDrop: CanDrop;

  /**
   * Function to determine how the data should be converted to `ITreeNode`
   */
  @Input() nodeParser: TransformFunction;

  /**
   * Function to determine how the tree should get the root data.
   */
  @Input() getRoot: GetRootFunction;

  /**
   * Function to determine how the tree should get the children nodes of a node.
   */
  @Input() getChildren: GetChildrenFunction;

  /**
   * Function to determine how the tree should load an entire branch.
   * This function is called at the initialization after the `getRoot` is called.
   */
  @Input() getBranch: GetBranchFunction;

  /**
   * Flag to determine whether the logic to get children should use the in memory cache.
   */
  @Input() preventCache: boolean;

  /**
   * Flag to determine whether the tree should initiliaze with all its root node expanded.
   */
  @Input() expandAll: boolean;

  /**
   * The branch details should be used to set trigger the branch loading from the component template.
   * Similarly, it can be triggered using the `ViewChild` of the `TreeviewComponent`
   */
  @Input()
  set branchDetails(value: IBranchDetails) {
    this.expandBranch.next(value);
  }

  /**
   * Emitter triggered when a node is selected from the UI or when the expandBranch is triggered as it selects the active node.
   * It emits the node id (uuid).
   */
  @Output() selectedNodeIdChanged = new EventEmitter<string>();

  /**
   * Emitter triggered when a node is selected from the UI or when the expandBranch is triggered as it selects the active node.
   * It emits the node `ITreeNode`.
   */
  @Output() selectedNodeChanged = new EventEmitter<ITreeNode>();

  /**
   * Emitter triggered when the node dragging starts.
   * CAUTION: This event is triggered whilst the user has the node on drag mode.
   * Check Story `Simple drag and drop` and observe how many times the event is triggered.
   */
  @Output() dragStart = new EventEmitter();

  /**
   * Emitter triggered when the node is over another node.
   * CAUTION: This event is triggered whilst the user has the node on drag mode.
   * Check Story `Simple drag and drop` and observe how many times the event is triggered.
   */
  @Output() dragOver = new EventEmitter();

  /**
   * Emitter triggered when the drag ends.
   */
  @Output() dragEnd = new EventEmitter();

  /**
   * Emitter triggered when the node is dropped into desired position.
   */
  @Output() dragDrop = new EventEmitter();

  @ViewChild('emptyItem') emptyItem: ElementRef;

  // Common fields
  dataSource: TreeviewDataSource;
  dragNode: ITreeNode;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: DropPosition;
  dragNodeCanDrop: boolean;
  selectedBranch: string[];
  helper: TreeComponentHelper;

  // Stream fields
  addNode = new Subject<{ node: any; parentId?: string }>();
  deleteNode = new Subject<{ nodeId: string; parentId?: string }>();
  updateNode = new Subject<any>();
  refresh = new EventEmitter<boolean>();
  selectedNodeId = new BehaviorSubject<string>(null);
  expandBranch = new BehaviorSubject<IBranchDetails>(null);
  unsubscribe = new Subject();

  get treeControl(): TreeControl {
    return this.dataSource ? this.dataSource.treeControl : null;
  }

  getLevel = (node: ITreeNode): number => node.level;
  isExpandable = (node: ITreeNode): boolean => node.expandable;
  hasChild = (index: number, node: ITreeNode): boolean => node.expandable;
  trackBy = (index: number, node: ITreeNode): string => node.trackingId;

  constructor() {
    this.helper = new TreeComponentHelper(this);
  }

  ngOnInit(): void {
    this.initTree();
    this.initSubscribers();
  }

  ngAfterViewInit(): void {
    this.dataSource.initComplete
      .pipe(
        filter((started) => started),
        tap(() => this.helper.expandAllHandler()),
        mergeMap(() => this.expandBranch),
        filter((branch) => branch !== null && branch !== undefined),
        debug('Expand branch requested', this.enableDebug),
        mergeMap((branch) => this.dataSource.expandBranch(branch)),
        tap((details) => this.helper.emitBranchDetails(details)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => this.helper.buildSelectedBranch());
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onNodeSelected(node: ITreeNode): void {
    this.selectedNodeId.next(node.id);
    this.selectedNodeChanged.emit(node);
  }

  onNodeDoubleClicked(node: ITreeNode): void {
    this.treeControl.toggle(node);
  }

  onDragStart(event: DragEvent, node: ITreeNode): void {
    if (!this.enableDragAndDrop) {
      event.preventDefault();
      return;
    }
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
    this.dragStart.emit({ event, node });
  }

  onDragOver(event: DragEvent, node: ITreeNode): void {
    event.preventDefault();

    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        const shouldExpand =
          new Date().getTime() - this.dragNodeExpandOverTime >
          this.dragNodeExpandOverWaitTimeMs;

        if (shouldExpand) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    this.dragNodeExpandOverArea = DataSourceHelper.handleDragArea(event);
    this.dragNodeCanDrop =
      !this.canDrop ||
      this.canDrop({
        node: this.dragNode,
        target: node,
        position: this.dragNodeExpandOverArea,
      });

    this.dragStart.emit({ event, node, canDrop: this.dragNodeCanDrop });
  }

  onDrop(event: DragEvent, node: ITreeNode): void {
    event.preventDefault();

    const canDrop =
      !this.canDrop ||
      this.canDrop({
        node: this.dragNode,
        target: node,
        position: this.dragNodeExpandOverArea,
      });

    if (node !== this.dragNode && canDrop) {
      if (this.dragNodeExpandOverArea === DropPosition.Above) {
        this.dataSource.moveAboveTarget(this.dragNode, node);
      } else if (this.dragNodeExpandOverArea === DropPosition.Below) {
        this.dataSource.moveBelowTarget(this.dragNode, node);
      } else {
        this.dataSource.moveUnderTarget(this.dragNode, node);
      }
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;

    this.dragDrop.emit({
      event,
      node: this.dragNode,
      targetNode: node,
      expandArea: this.dragNodeExpandOverArea,
      canDrop,
    });
  }

  onDragEnd(event): void {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
    this.dragEnd.emit(event);
  }

  private initTree() {
    this.dataSource = new TreeviewDataSource(
      this.getLevel,
      this.isExpandable,
      this.nodeParser,
      this.getRoot,
      this.getChildren,
      this.getBranch,
      this.enableDebug,
      this.preventCache
    );
  }

  private initSubscribers() {
    this.selectedNodeId
      .pipe(
        debounceTime(200),
        debug('Selected id changed', this.enableDebug),
        tap((id) => this.selectedNodeIdChanged.emit(id)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => this.helper.buildSelectedBranch());

    this.deleteNode
      .pipe(
        debug('Delete node called', this.enableDebug),
        takeUntil(this.unsubscribe)
      )
      .subscribe((node) => this.helper.deleteNodeHandler(node));

    this.addNode
      .pipe(
        debug('Add node called', this.enableDebug),
        takeUntil(this.unsubscribe)
      )
      .subscribe((data) => this.helper.addNodeHandler(data));

    this.updateNode
      .pipe(
        debug('Update node called', this.enableDebug),
        takeUntil(this.unsubscribe)
      )
      .subscribe((data) => this.dataSource.updateNode(data));

    this.refresh
      .pipe(
        mergeMap(() => this.treeControl.loadRoot()),
        debug('Refresh Root', this.enableDebug),
        tap((data) => this.dataSource.updateTreeData(data)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => this.helper.buildSelectedBranch());
  }
}
