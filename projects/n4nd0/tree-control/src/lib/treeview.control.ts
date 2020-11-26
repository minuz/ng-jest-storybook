import { FlatTreeControl } from '@angular/cdk/tree';
import { cloneDeep } from 'lodash';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { debug } from './helpers/pipe.operators';
import { TreeControlHelper } from './helpers/tree.control.helper';
import {
  GetBranchFunction,
  GetChildrenFunction,
  GetRootFunction,
  ITreeNode,
  TransformFunction,
} from './models/treeview.models.interfaces';
import { TreeviewDataSource } from './treeview.datasource';

/**
 * Class extending the Material `FlatTreeControl`.
 * It has the purpose of adding extra functionality that belongs to the tree.
 */
export class TreeControl extends FlatTreeControl<ITreeNode> {
  treeHelper: TreeControlHelper;
  constructor(
    private dataSource: TreeviewDataSource,
    public getLevel: (dataNode: ITreeNode) => number,
    public isExpandable: (dataNode: ITreeNode) => boolean,
    public nodeParser: TransformFunction,
    private getRoot: GetRootFunction,
    public getChildren: GetChildrenFunction,
    private getBranch?: GetBranchFunction,
    private isDebug: boolean = false,
  ) {
    super(getLevel, isExpandable);
    this.treeHelper = new TreeControlHelper(this);
  }

  /**
   * Exposes the getRoot method and automatically parse the result to ITreeNode[].
   */
  loadRoot(): Observable<ITreeNode[]> {
    let loadRoot = this.getRoot();
    if (Array.isArray(loadRoot)) {
      loadRoot = observableOf(loadRoot);
    }
    return loadRoot.pipe(
      debug('Root data loaded', this.isDebug),
      map((data) => this.treeHelper.toTreeNode(data)),
      debug('Root data parsed', this.isDebug),
    );
  }

  /**
   * Exposes the getChildren method and automatically parse the result to ITreeNode[]
   */
  loadChildren(pNode: ITreeNode): Observable<ITreeNode[]> {
    let loadChildren = this.getChildren(pNode);

    if (Array.isArray(loadChildren)) {
      loadChildren = observableOf(loadChildren);
    }

    return loadChildren.pipe(
      debug(`Children of '${pNode.title}' loaded`, this.isDebug),
      map((data) => this.treeHelper.toTreeNode(data, pNode)),
      debug(`Children of '${pNode.title}' parsed`, this.isDebug),
    );
  }

  /**
   * Exposes the getBranch, automatically order the branch and parse the data to ITreeNode.
   * NOTE: The branch loader assumes the parent/child relationship is established based on parentId.
   * It uses the parentId to set the correct levels. In case the provided data does not contain a parentId,
   * the branch will be created on the order it has been passed.
   */
  loadBranch(
    id: string,
    parentId: string,
    nodeType: string,
  ): Observable<ITreeNode[]> {
    if (this.getBranch) {
      let loadBranch = this.getBranch(id, parentId, nodeType);
      if (Array.isArray(loadBranch)) {
        loadBranch = observableOf(loadBranch);
      }

      return loadBranch.pipe(
        debug('Branch data loaded', this.isDebug),
        map((data) => this.dataSource.helper.orderBranch(data)),
        debug('Branch data ordered', this.isDebug),
        this.treeHelper.parseOrUpdate,
        debug('Branch data parsed', this.isDebug),
      );
    } else {
      return observableOf([]);
    }
  }

  /**
   * Find the parent node from a node id by iterating through the data collection.
   * The parent/child relationship is defined by the node level.
   */
  findParent(id: string): ITreeNode | null {
    const node = this.findNodeById(id);
    if (node.level > 0) {
      const nodeIndex = this.findNodeIndex(id);

      for (let index = nodeIndex; index >= 0; index--) {
        const element = this.dataNodes[index];
        if (element.level === node.level - 1) {
          return element;
        }
      }
    }
    return null;
  }

  /**
   * Find the node based on its id.
   */
  findNodeById(id: string): ITreeNode | null {
    return id && this.dataNodes
      ? this.dataNodes.find((n) => n.id === id)
      : null;
  }

  /**
   * Find the node index based on its id.
   */
  findNodeIndex(id: string): number {
    return id && this.dataNodes
      ? this.dataNodes.findIndex((n) => n.id === id)
      : -1;
  }

  /**
   * Converts the current `ITreeNode` dataset into a hierarchical data based on the level and `ITreeNode.data`
   * Since the `findChildren` mutates the data, we clone the original `dataNodes` so there's no impact on the
   * current rendered tree nodes.
   */
  toNestedTree<T>(): T[] {
    const clonedData = cloneDeep(this.dataNodes);
    const result = clonedData
      .filter((n) => n.level === 0) // Set Root nodes
      .map((node) => this.treeHelper.findChildren(node, clonedData)); // Find children for each root.

    return result;
  }
}
