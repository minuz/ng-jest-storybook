import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { TreeviewComponent } from './treeview.component';

@NgModule({
  declarations: [TreeviewComponent],
  imports: [CommonModule, MatButtonModule, MatTreeModule, MatIconModule],
  exports: [TreeviewComponent],
})
export class TreeviewModule {}
