import { IBranchDetails } from '../models/treeview.models.interfaces';
import { TreeviewComponent } from '../treeview.component';
import { consoleDebug } from './pipe.operators';

/**
 * Helper class for the TreeComponent.
 * Its purpose is to remove a bit of the clutter from the component class.
 * All private methods have been abstracted to this class.
 * Getters and setters have been added to ensure values are properly synced with main class.
 */
export class TreeComponentHelper {
  get selectedNodeId() {
    return this.component.selectedNodeId;
  }

  get treeControl() {
    return this.component.treeControl;
  }

  get dataSource() {
    return this.component.dataSource;
  }

  get selectedBranch() {
    return this.component.selectedBranch;
  }

  set selectedBranch(value: string[]) {
    this.component.selectedBranch = value;
  }

  get enableDebug() {
    return this.component.enableDebug;
  }

  constructor(private component: TreeviewComponent) {}

  buildSelectedBranch() {
    if (this.selectedNodeId.value) {
      const nIndex = this.treeControl.findNodeIndex(this.selectedNodeId.value);

      if (nIndex >= 0) {
        let lookupLevel = this.dataSource.data[nIndex].level - 1;

        this.selectedBranch = new Array<string>(lookupLevel + 1);

        for (let index = nIndex; index >= 0 && lookupLevel >= 0; index--) {
          const element = this.dataSource.data[index];
          if (element.level === lookupLevel) {
            this.selectedBranch[lookupLevel--] = element.id;
          }
        }
      } else {
        this.selectedBranch = [];
      }
    }
    consoleDebug(
      'BuildSelectedBranch executed',
      this.selectedBranch,
      this.enableDebug,
    );
  }

  expandAllHandler(): void {
    setTimeout(() => {
      if (this.component.expandAll) {
        this.treeControl.expandAll();
      }
    }, 50);
  }

  emitBranchDetails(branchDetails: IBranchDetails): void {
    this.selectedNodeId.next(branchDetails.nodeId);
    const node = this.treeControl.findNodeById(branchDetails.nodeId);
    this.component.selectedNodeChanged.emit(node);
  }

  addNodeHandler(data: any) {
    this.dataSource.addNode(data.node, data.parentId);
    this.selectedNodeId.next(data.node.id);
    this.buildSelectedBranch();
  }

  deleteNodeHandler(toDelete: any) {
    this.dataSource.deleteNode(toDelete.nodeId);
    if (toDelete.parentId) {
      this.selectedNodeId.next(toDelete.parentId);
      this.buildSelectedBranch();
      const pNode = this.treeControl.findNodeById(toDelete.parentId);
      if (pNode && !this.treeControl.isExpanded(pNode)) {
        this.treeControl.expand(pNode);
      }
    }
  }
}
