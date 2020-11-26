import { DataSource, SelectionChange } from '@angular/cdk/collections';
import { merge } from 'lodash';
import { BehaviorSubject, Observable, of as observableOf, Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { DataSourceHelper } from './helpers/datasource.helper';
import { consoleDebug, debug, toConsole } from './helpers/pipe.operators';
import {
  DropPosition,
  GetBranchFunction,
  GetChildrenFunction,
  GetRootFunction,
  IBranchDetails,
  ITreeNode,
  TransformFunction,
} from './models/treeview.models.interfaces';
import { TreeControl } from './treeview.control';

/**
 * Data source for flat tree.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `MatTree`.
 * The nested tree nodes of type `T` are flattened through the provided `nodeParser`, and converted
 * to type `ITreeNode` for `MatTree` to consume.
 */
export class TreeviewDataSource extends DataSource<ITreeNode> {
  helper: DataSourceHelper;
  dataChange = new BehaviorSubject<ITreeNode[]>([]);
  initComplete = new BehaviorSubject<boolean>(false);
  treeControl: TreeControl;
  private _unsubscribe = new Subject();

  get data(): ITreeNode[] {
    return this.dataChange.value;
  }

  constructor(
    public getLevel: (dataNode: ITreeNode) => number,
    public isExpandable: (dataNode: ITreeNode) => boolean,
    public nodeParser: TransformFunction,
    private getRoot: GetRootFunction,
    public getChildren: GetChildrenFunction,
    private getBranch?: GetBranchFunction,
    public isDebug: boolean = false,
    public preventCache: boolean = false
  ) {
    super();

    this.helper = new DataSourceHelper(this);
    this.treeControl = new TreeControl(
      this,
      getLevel,
      isExpandable,
      nodeParser,
      getRoot,
      getChildren,
      getBranch,
      isDebug
    );

    this.treeControl
      .loadRoot()
      .pipe(
        tap(() => this.initComplete.next(true)),
        takeUntil(this._unsubscribe)
      )
      .subscribe((data) => this.updateTreeData(data));
  }

  /**
   * Connects a collection viewer to this data source. Note that
   * the stream provided will be accessed during change detection and should not directly change
   * values that are bound in template views.
   * @param collectionViewer The component that exposes a view over the data provided by this
   *     data source.
   * @returns Observable that emits a new value when the data changes.
   */
  connect(): Observable<ITreeNode[]> {
    this.treeControl.expansionModel.changed
      .pipe(
        filter((c) => c.added.length > 0 || c.removed.length > 0),
        debug('ExpansionModel changed', this.isDebug),
        takeUntil(this._unsubscribe)
      )
      .subscribe((change) => this.onSelectionChange(change));

    return this.dataChange;
  }

  /**
   * Disconnects a collection viewer (such as a data-table) from this data source. Can be used
   * to perform any clean-up or tear-down operations when a view is being destroyed.
   *
   * @param collectionViewer The component that exposes a view over the data provided by this
   *     data source.
   */
  disconnect(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Method to update the values on the `TreeControl` which renders the data into the view.
   * When the data nodes are manipulated, use this method to consolidate the current nodes to the view.
   * Includes console debugger that can be enabled via `isDebug` flag.
   */
  updateTreeData(value?: ITreeNode[]) {
    const newData = value ? value : this.data;

    this.treeControl.dataNodes = newData;
    this.dataChange.next(newData);
    consoleDebug('Tree data modified', newData, this.isDebug);
  }

  /**
   * Handle expand/collapse behaviors triggered from the view.
   */
  onSelectionChange(change: SelectionChange<ITreeNode>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }

    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  /**
   * Add a node to the tree control.
   * There are situations where there is no parent and this method handles this case.
   */
  addNode(node: any, parentId?: string) {
    const pNode = parentId ? this.treeControl.findNodeById(parentId) : null;
    const newNodeLevel = pNode ? pNode.level + 1 : 0;
    const newNode = this.treeControl.nodeParser(node, newNodeLevel);

    if (parentId) {
      this.appendChildren(pNode, [newNode]);
    } else {
      this.data.push(node);
    }

    this.updateTreeData();
    if (!this.treeControl.isExpanded(pNode)) {
      this.treeControl.expand(pNode);
    }
  }

  /**
   * Insert a node into a determined position.
   * It finds the index on which the node should be inserted.
   * Should be used by the drag and drop or other component that knows exactly the position.
   */
  insertNode(newNode: ITreeNode, target: ITreeNode, position: DropPosition) {
    const insertPosition = this.helper.getInsertPosition(
      this.treeControl,
      target,
      position,
      newNode
    );
    this.data.splice(insertPosition, 0, newNode);
    this.updateTreeData();
    consoleDebug('Insert node invoked.', newNode, this.isDebug);
  }

  /**
   * Update a node details based on its original data.
   * It will use the provided parser and throw exception if the data does not correspond with the parser.
   */
  updateNode(toUpdate: any) {
    const nodeIndex = this.treeControl.findNodeIndex(toUpdate.id);
    if (nodeIndex >= 0) {
      const currentNode = this.treeControl.findNodeById(toUpdate.id);
      merge(currentNode, this.nodeParser(toUpdate, currentNode.level));
      currentNode.trackChange();
      this.data[nodeIndex] = currentNode;
      this.updateTreeData();
    } else {
      consoleDebug(
        'Node update failes. Could not find node on tree.',
        toUpdate,
        this.isDebug
      );
    }
  }

  /**
   * Move the node to a determined position based on the index of the target node.
   * In addition, it modified the change tracker of both nodes.
   */
  moveNode(node: ITreeNode, target: ITreeNode, offset: number, level: number) {
    const nodeIndex = this.treeControl.findNodeIndex(node.id);
    // remove node
    this.data.splice(nodeIndex, 1);
    node.level = level;
    const targetIndex = this.treeControl.findNodeIndex(target.id);
    // skip children of target
    while (
      targetIndex + offset < this.data.length &&
      this.data[targetIndex + offset].level > level
    ) {
      offset++;
    }
    this.data.splice(targetIndex + offset, 0, node);
    node.trackChange();
    target.trackChange();

    consoleDebug(
      'Move node invoked.',
      { node, target, offset, level },
      this.isDebug
    );
  }

  /**
   * Moves a node above a target (same level)
   */
  moveAboveTarget(node: ITreeNode, target: ITreeNode) {
    this.moveNode(node, target, 0, target.level);
    this.updateTreeData();
  }

  /**
   * Moves a node below a target (same level)
   */
  moveBelowTarget(node: ITreeNode, target: ITreeNode) {
    this.moveNode(node, target, 1, target.level);
    this.updateTreeData();
  }

  /**
   * Moves a node as a child of a target. It prepends it to the children.
   */
  moveUnderTarget(node: ITreeNode, target: ITreeNode) {
    target.expandable = true;
    target.trackChange();
    this.treeControl.expansionModel.select(target);
    this.moveNode(node, target, 1, target.level + 1);
    this.updateTreeData();
  }

  /**
   * Remove the node from the tree and remove the node from the parent cache if it has parent.
   * Note: This method automatically sync the data to the `TreeControl`
   */
  deleteNode(id: string) {
    const pNode = this.treeControl.findParent(id);
    if (pNode && pNode.childrenCache && pNode.childrenCache.length) {
      pNode.childrenCache = pNode.childrenCache.filter((n) => n.id !== id);
    }

    this.updateTreeData(this.data.filter((n) => n.id !== id));
  }

  /**
   * Toggle the node, add or remove from display list
   */
  toggleNode(pNode: ITreeNode, expand: boolean) {
    if (pNode && pNode.expandable) {
      const toggle = expand
        ? this.expandNode(pNode)
        : this.collapseBranch(pNode);

      toggle
        .pipe(
          filter((data) => data !== null || data !== undefined),
          debug('Node toggled', this.isDebug),
          takeUntil(this._unsubscribe)
        )
        .subscribe(() => this.updateTreeData());
    }
  }

  /**
   * A stream that handles the expansion of a single node.
   * It contains an option to use cache.
   * It does nothing if the node is defined as not expandable.
   */
  expandNode(pNode: ITreeNode) {
    if (!pNode.childrenCache || this.preventCache) {
      pNode.isLoading = true;
      consoleDebug(`Expanding node '${pNode.title}'`, pNode, this.isDebug);
      return this.treeControl.loadChildren(pNode).pipe(
        tap(() => (pNode.isLoading = false)),
        mergeMap((children) => this.appendChildren(pNode, children))
      );
    } else {
      return this.appendChildren(pNode, pNode.childrenCache);
    }
  }

  /**
   * Certain tree requires to load the entire branch.
   * This method exposes the getBranch method provided via input.
   * It also load and expands all branch nodes and add it the `TreeControl`
   * The stream returns the input information.
   */
  expandBranch(branch: IBranchDetails): Observable<IBranchDetails> {
    if (!branch) {
      toConsole('No branch to load', this.isDebug);
      return observableOf();
    }

    // Branch loading is optional
    if (!this.getBranch) {
      toConsole('A GetBranch was not provided.', this.isDebug);
      return observableOf();
    }

    return this.treeControl
      .loadBranch(branch.nodeId, branch.parentId, branch.nodeType)
      .pipe(
        map((data) => this.helper.appendBranchItems(data)),
        debug('Brach added to tree', this.isDebug),
        map((data) => this.helper.expandEachNode(data)),
        map(() => branch)
      );
  }

  /**
   * Stream that collapse the entire branch based on the toggled node.
   * The collapsed nodes are added to the toggled node as children cache.
   */
  collapseBranch(node: ITreeNode) {
    const pIndex = this.data.findIndex((n) => n.id === node.id);
    const descendents = this.treeControl.getDescendants(node);
    this.data[pIndex].childrenCache = this.data.splice(
      pIndex + 1,
      descendents.length
    );
    return observableOf(node);
  }

  /**
   * Creates a stream that appends a children collection of `ITreeNode` to the display list.
   * NOTE: This stream does not sync the data to the `TreeControl`
   */
  appendChildren(pNode: ITreeNode, children?: ITreeNode[]) {
    pNode.isLoading = false;
    pNode.trackChange();

    const pIndex = this.treeControl.findNodeIndex(pNode.id);

    children.forEach((child, index) => {
      const nodeExist = this.treeControl.findNodeById(child.id);
      if (nodeExist) {
        children[index] = nodeExist;
        const nodeExistIndex = this.treeControl.findNodeIndex(child.id);
        this.data.splice(nodeExistIndex, 1);
      }
    });

    this.data.splice(pIndex + 1, 0, ...children);
    return observableOf(pNode);
  }
}
