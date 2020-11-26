import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { Observable, of as observableOf, Subject } from 'rxjs';

import { ITestData, ITestDataPId } from '../models/treeview.mock.models';
import { TreeNode } from '../models/treeview.models';
import { ITreeNode } from '../models/treeview.models.interfaces';
import { TreeMockData } from './mock.data';

// tslint:disable:max-classes-per-file
export class TestHelper {
  static getStandardDependencies() {
    return {
      getLevel: this.getLevel,
      isExpandable: this.isExpandable,
      nodeParser: this.nodeParser,
      getRoot: this.getRoot,
      getChildren: this.getChildren,
      getBranch: this.getBranch,
    };
  }

  static getLevel = (node: ITreeNode) => node.level;

  static isExpandable = (node: ITreeNode) =>
    node.data.children && node.data.children.length

  static nodeParser = (node: ITestData, level: number) => {
    return new TreeNode(
      node.key,
      node.name,
      node,
      level,
      node.children && node.children.length ? true : false,
      false,
      true,
    );
  }

  static nodeParser2 = (node: ITestDataPId, level: number) => {
    return new TreeNode(
      node.id,
      node.name,
      node,
      level,
      node.children && node.children.length ? true : false,
      false,
      true,
    );
  }

  static getRoot = () => observableOf([...TreeMockData.simpleHierarchicalData]);
  static getChildren = (node: ITreeNode) => node.data.children;

  // Get branch for TreeMockData.dataWithParentId
  static getBranch = (nodeId: string) => {
    const flatTree = [];
    const flattenTreeDeep = (nodeList: any[]) => {
      nodeList.forEach((node) => {
        flatTree.push(node);
        if (node.children && node.children.length) {
          flattenTreeDeep(node.children);
        }
      });
    };

    flattenTreeDeep(TreeMockData.dataWithParentId);

    const result = [];
    const buildBranch = (id: string) => {
      const lastNode = flatTree.find((node) => node.id === id);
      result.push(lastNode);
      if (lastNode.parentId) {
        buildBranch(lastNode.parentId);
      }
    };

    buildBranch(nodeId);

    return result.reverse();
  }
}

export class CollectionViewerMock implements CollectionViewer {
  private _viewChange = new Subject<ListRange>();

  get viewChange(): Observable<ListRange> {
    return this._viewChange;
  }
  set viewChange(value: Observable<ListRange>) {
    throw new Error('setting viewChange is not supported by the mock');
  }
}
