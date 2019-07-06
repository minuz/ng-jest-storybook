import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITreeNode } from '../models/treeview.models.interfaces';
import { TreeControl } from '../treeview.control';

/**
 * Helper class for the `TreeControl`.
 * It contains abstractions to make the `TreeControl` methods more readable.
 *
 * @export
 * @class TreeControlHelper
 */
export class TreeControlHelper {
  constructor(public tree: TreeControl) {}

  /**
   * Parse an array of raw data using the provided node parser.
   *
   * @param {any[]} data
   * @param {ITreeNode} [parent]
   * @returns {ITreeNode[]}
   * @memberof TreeControl
   */
  toTreeNode(data: any[], parent?: ITreeNode): ITreeNode[] {
    return data.map((n) =>
      this.tree.nodeParser(n, parent ? parent.level + 1 : 0),
    );
  }

  /**
   * Pipeable method that parses a single node to ITreeNode.
   * If the node already exist on the tree, it fetches it than update the node details,
   * Trigger the `trackChange()` and return the updated node.
   *
   * @memberof TreeControlHelper
   */
  parseOrUpdate = (source: Observable<any>) =>
    source.pipe(
      map((data) =>
        data.map((node: any, index: number) =>
          this.parseOrUpdateInternal(node, index),
        ),
      ),
    );

  /**
   * Given a parent node (pNode), find its children.
   * This method mutates the data.
   *
   * @param {ITreeNode} pNode
   * @param {ITreeNode[]} dataNodes
   * @returns
   * @memberof TreeControlHelper
   */
  findChildren(pNode: ITreeNode, dataNodes: ITreeNode[]) {
    pNode.data.children = [];
    const pIndex = this.tree.findNodeIndex(pNode.id);
    return this.findChildrenRecursive(pNode, pIndex, dataNodes, pNode.level);
  }

  private findChildrenRecursive(
    node: ITreeNode,
    pIndex: number,
    dataNodes: ITreeNode[],
    level: number,
  ) {
    if (!node.data.children) {
      node.data.children = [];
    }

    for (let i = pIndex + 1; i < dataNodes.length; i++) {
      const item = dataNodes[i];
      if (item.level === 0) {
        break;
      } else if (item.level > level) {
        level++;
        const children = this.findChildrenRecursive(item, i, dataNodes, level);
        node.data.children.push(...children);
      } else {
        node.data.children.push(item.data);
      }
    }

    return node.data;
  }
  private parseOrUpdateInternal(item: any, index: number): ITreeNode {
    const node = this.tree.findNodeById(item.id);
    if (node) {
      node.data = item;
      node.id = item.id;
      node.trackChange();
      return node;
    } else {
      return this.tree.nodeParser(item, index);
    }
  }
}
