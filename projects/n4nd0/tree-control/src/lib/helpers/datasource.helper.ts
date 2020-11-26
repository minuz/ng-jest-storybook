import { DropPosition, ITreeNode } from '../models/treeview.models.interfaces';
import { TreeControl } from '../treeview.control';
import { TreeviewDataSource } from '../treeview.datasource';

/**
 * Helper class for the TreeviewDataSource
 */
export class DataSourceHelper {
  get treeControl() {
    return this.dataSource.treeControl;
  }

  get data() {
    return this.dataSource.data;
  }

  constructor(public dataSource: TreeviewDataSource) {}

  /**
   * When dragging a node, this method calculates the expanding area where the node can be dropped.
   */
  static handleDragArea(event: DragEvent) {
    let dragNodeExpandOverArea;
    const percentageY = event.offsetY / (event.target as any).clientHeight;
    if (percentageY < 0.25) {
      dragNodeExpandOverArea = DropPosition.Above;
    } else if (percentageY > 0.75) {
      dragNodeExpandOverArea = DropPosition.Below;
    } else {
      dragNodeExpandOverArea = DropPosition.Under;
    }

    return dragNodeExpandOverArea;
  }

  /**
   * Method that determines the node level based on target node and the provided position to be dropped.
   */
  getInsertPosition(
    treeControl: TreeControl,
    target: ITreeNode,
    position: DropPosition,
    newNode: ITreeNode,
  ) {
    let insertPosition = 0;
    let level = 0;
    if (target != null) {
      const parentIndex = treeControl.findNodeIndex(target.id);
      switch (position) {
        case DropPosition.Above:
          insertPosition = parentIndex;
          level = target.level;
          break;
        case DropPosition.Under:
          insertPosition = parentIndex + 1;
          level = target.level + 1;
          break;
        case DropPosition.Below:
          // skip existing node and children
          insertPosition = parentIndex + 1;
          while (
            insertPosition < treeControl.dataNodes.length &&
            treeControl.dataNodes[insertPosition].level > target.level
          ) {
            insertPosition++;
          }
          level = target.level;
          break;
      }
    }
    newNode.level = level;
    return insertPosition;
  }

  /**
   * Helper to append the branch items into the current tree
   */
  appendBranchItems(branch: ITreeNode[]) {
    const rootNode = branch[0];
    const rootIndex = this.dataSource.treeControl.findNodeIndex(rootNode.id);

    // Check if root exist
    if (rootIndex < 0) {
      this.data.push(...branch);
    } else {
      // Remove the root as it already exist on the tree.
      // Duplicating as we need the original branch definition to expand all nodes.
      const noRootBranch = [...branch];
      noRootBranch.splice(0, 1);
      this.data.splice(rootIndex + 1, 0, ...noRootBranch);
    }

    this.dataSource.updateTreeData();
    return branch;
  }

  expandEachNode(branch: ITreeNode[]) {
    branch.forEach((node, index) => {
      if (
        node.expandable &&
        !this.treeControl.isExpanded(node) &&
        index !== branch.length - 1
      ) {
        this.treeControl.expand(node);
      }
    });
  }

  /**
   * For correct node positioning, the nodes need to be sequential.
   * Some data may not be in the correct order so we order the received data
   * based on the existence of parentId.
   * In case the data does not have a parentId, the order must be handled on the getBranch
   */
  orderBranch(branch: any[]) {
    if (branch.some((n) => n.parentId)) {
      const orderedBranch = [];
      const rootNode: any = branch.find((node: any) => !node.parentId);
      orderedBranch.push(rootNode);

      const recursiveGetChildren = (node: any) => {
        const children = branch.filter((n: any) => n.parentId === node.id);
        if (children && children.length) {
          orderedBranch.push(...children);
          const firstChild = children[0];
          recursiveGetChildren(firstChild);
        }
      };

      recursiveGetChildren(rootNode);

      // Some branches may have mixed object with parentId and no parentId
      const noParents = branch.filter((n) => n.parentId === undefined);
      orderedBranch.push(...noParents);
      return orderedBranch;
    }

    return branch;
  }
}
