import { ITreeNode } from './treeview.models.interfaces';

export class TreeNode implements ITreeNode {
  changeCount: number;
  trackingId: string;
  childrenCache?: ITreeNode[];

  constructor(
    public id: string,
    public title: string,
    public data: any,
    public level: number,
    public expandable: boolean,
    public isLoading: boolean,
    public isLoaded: boolean,
    public icon?: string,
    public nodeType?: string,
  ) {
    this.changeCount = 0;
    this.trackingId = id + '_0';
  }

  trackChange() {
    {
      this.changeCount++;
      this.trackingId = `${this.id}_${this.changeCount}`;
    }
  }
}
