import {
  DropPosition,
  INodeDrop,
  ITestData,
  ITestDataPId,
  ITreeNode,
  TreeMockData,
  TreeNode
} from '@n4nd0/tree-control';
import { action } from '@storybook/addon-actions';

// tslint:disable:max-classes-per-file
export class TreeTemplates {
  static complete = `
  <div class="nav-full-height" style="width: 30%;">
    <wb-treeview
      [enableDebug]="enableDebug"
      [enableDragAndDrop]="enableDragAndDrop"
      [indent]="indent"
      [canDrop]="canDrop"
      [nodeParser]="nodeParser"
      [getRoot]="getRoot"
      [getChildren]="getChildren"
      [getBranch]="getBranch"
      [preventCache]="preventCache"
      [expandAll]="expandAll"
      [branchDetails]="branchDetails"
      (selectedNodeIdChanged)="selectedNodeIdChanged($event)"
      (selectedNodeChanged)="selectedNodeChanged($event)"
      (dragStart)="dragStart($event)"
      (dragOver)="dragOver($event)"
      (dragEnd)="dragEnd($event)"
      (dragDrop)="dragDrop($event)"
    ></wb-treeview>
  </div>
  `;

  static minimum = `
  <div class="nav-full-height" style="width: 30%;">
    <wb-treeview
      [nodeParser]="nodeParser"
      [getRoot]="getRoot"
      [getChildren]="getChildren"
    ></wb-treeview>
  </div>
  `;

  static dragdrop = `
  <div class="nav-full-height" style="width: 30%;">
    <wb-treeview
      [enableDragAndDrop]="enableDragAndDrop"
      [canDrop]="canDrop"
      [nodeParser]="nodeParser"
      [getRoot]="getRoot"
      [getChildren]="getChildren"
      (selectedNodeChanged)="selectedNodeChanged($event)"
      (dragStart)="dragStart($event)"
      (dragOver)="dragOver($event)"
      (dragEnd)="dragEnd($event)"
      (dragDrop)="dragDrop($event)"
    ></wb-treeview>
  </div>
  `;
}

export class TreeStoryHelper {
  static componentTests = [
    'treeview.component.spec.ts',
    'treeview.datasource.spec.ts',
    'treeview.control.spec.ts',
    'datasource.helper.spec.ts'
  ];
  static componentOverview = {
    enabled: true,
    title: 'Tree Control',
    filename: 'lib/treeview.component',
    exportClass: 'TreeviewComponent'
  };
  static getLevel = (node: ITreeNode) => node.level;
  static isExpandable = (node: ITreeNode) =>
    node.data.children && node.data.children.length;

  static nodeParser = (node: ITestData, level: number) => {
    return new TreeNode(
      node.key,
      node.name,
      node,
      level,
      node.children && node.children.length ? true : false,
      false,
      true
    );
  };

  static nodeParser2 = (node: ITestDataPId, level: number) => {
    return new TreeNode(
      node.id,
      node.name,
      node,
      level,
      node.children && node.children.length ? true : false,
      false,
      true
    );
  };

  static restricDrop2Levels = (drop: INodeDrop) => {
    let canDrop = false;
    switch (drop.position) {
      case DropPosition.Below:
      case DropPosition.Above:
        canDrop =
          !drop.node.data.children ||
          drop.node.data.children.length === 0 ||
          drop.target.level === 0;
        break;
      case DropPosition.Under:
        canDrop =
          (!drop.node.data.children || drop.node.data.children.length === 0) &&
          drop.target.level === 0;
        break;
    }

    return canDrop;
  };

  // Get branch for TreeMockData.dataWithParentId
  static getBranch = (nodeId: string) => {
    const flatTree = [];
    const flattenTreeDeep = (nodeList: any[]) => {
      nodeList.forEach(node => {
        flatTree.push(node);
        if (node.children && node.children.length) {
          flattenTreeDeep(node.children);
        }
      });
    };

    flattenTreeDeep(TreeMockData.dataWithParentId);

    const result = [];
    const buildBranch = (id: string) => {
      const lastNode = flatTree.find(node => node.id === id);
      result.push(lastNode);
      if (lastNode.parentId) {
        buildBranch(lastNode.parentId);
      }
    };

    buildBranch(nodeId);

    return result.reverse();
  };
}

export class TreeProps {
  static complete = {
    enableDebug: true,
    enableDragAndDrop: true,
    indent: 20,
    canDrop: () => true,
    nodeParser: TreeStoryHelper.nodeParser,
    getRoot: () => TreeMockData.hierarchicalData,
    getChildren: (node: ITreeNode) => node.data.children,
    getBranch: TreeStoryHelper.getBranch,
    branchDetails: null,
    preventCache: false,
    expandAll: false,
    selectedNodeIdChanged: action('SelectedNodeIdChanged =>'),
    selectedNodeChanged: action('SelectedNodeChanged =>'),
    dragStart: action('dragStart => '),
    dragOver: action('dragOver => '),
    dragEnd: action('dragEnd => '),
    dragDrop: action('dragDrop => ')
  };

  static minimum = {
    nodeParser: TreeStoryHelper.nodeParser,
    getRoot: () => TreeMockData.hierarchicalData,
    getChildren: (node: ITreeNode) => node.data.children
  };

  static dragdrop = {
    enableDragAndDrop: true,
    canDrop: () => true,
    nodeParser: TreeStoryHelper.nodeParser,
    getRoot: () => TreeMockData.hierarchicalData,
    getChildren: (node: ITreeNode) => node.data.children,
    selectedNodeChanged: action('SelectedNodeChanged =>'),
    dragStart: action('dragStart => '),
    dragOver: action('dragOver => '),
    dragEnd: action('dragEnd => '),
    dragDrop: action('dragDrop => ')
  };
}
