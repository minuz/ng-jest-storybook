import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatTreeModule,
} from '@angular/material';

import { TreeviewComponent } from './treeview.component';

@NgModule({
  declarations: [TreeviewComponent],
  imports: [CommonModule, MatButtonModule, MatTreeModule, MatIconModule],
  exports: [TreeviewComponent],
})
export class TreeviewModule {}
