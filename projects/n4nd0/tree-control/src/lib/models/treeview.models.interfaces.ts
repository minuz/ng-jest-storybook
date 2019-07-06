import { Observable } from 'rxjs';

export enum DropPosition {
  Above = 'above',
  Below = 'below',
  Under = 'under',
}

export type CanDrop = (drop: INodeDrop) => boolean;
export type TransformFunction = (node: any, level: number) => ITreeNode;
export type GetChildrenFunction = (node: any) => Observable<any[]> | any[];
export type GetBranchFunction = (
  nodeId: string,
  parentId: string,
  nodeType: string,
) => Observable<any[]> | any[];
export type GetRootFunction = () => Observable<any[]> | any[];
export type IsExpandable = (node: ITreeNode) => boolean;
export interface INodeDrop {
  node: ITreeNode;
  target: ITreeNode;
  position: DropPosition;
}

export interface IDragAndDrop {
  moveAboveTarget(node: ITreeNode, target: ITreeNode);
  moveBelowTarget(node: ITreeNode, target: ITreeNode);
  moveUnderTarget(node: ITreeNode, target: ITreeNode);
}

export interface ITreeNode {
  id: string;
  title: string;
  level: number;
  expandable: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  icon?: string;
  changeCount: number;
  trackingId: string;
  nodeType?: string;
  childrenCache?: ITreeNode[];
  data: any;
  trackChange?: () => void;
}

export interface IBranchDetails {
  nodeId: string;
  parentId: string;
  nodeType: string;
}
