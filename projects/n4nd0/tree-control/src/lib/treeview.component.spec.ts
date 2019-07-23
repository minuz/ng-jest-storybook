import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatIconModule,
  MatTreeModule
} from '@angular/material';

import { TreeMockData } from './helpers/mock.data';
import { TestHelper } from './helpers/test.helper';
import { TreeviewComponent } from './treeview.component';

describe('TreeviewComponent', () => {
  let component: TreeviewComponent;
  let fixture: ComponentFixture<TreeviewComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonModule, MatButtonModule, MatTreeModule, MatIconModule],
      declarations: [TreeviewComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TreeviewComponent);
        component = fixture.componentInstance;
      });
  });

  test('can load instance', () => {
    expect(component).toBeTruthy();
  });
  test('enableDebug defaults to: false', () => {
    expect(component.enableDebug).toEqual(false);
  });
  test('enableDragAndDrop defaults to: false', () => {
    expect(component.enableDragAndDrop).toEqual(false);
  });
  test('indent defaults to: 20', () => {
    expect(component.indent).toEqual(20);
  });
  test('dragNodeExpandOverWaitTimeMs defaults to: 300', () => {
    expect(component.dragNodeExpandOverWaitTimeMs).toEqual(300);
  });

  test('minimum setup should match snapshot', () => {
    component.getRoot = TestHelper.getRoot;
    component.getChildren = TestHelper.getChildren;
    component.nodeParser = TestHelper.nodeParser;

    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      const rendered = fixture.nativeElement;
      expect(rendered).toMatchSnapshot();
    });
  });

  test('complete setup should match snapshot', () => {
    component.getRoot = TestHelper.getRoot;
    component.getChildren = TestHelper.getChildren;
    component.getBranch = () => [];
    component.nodeParser = TestHelper.nodeParser;
    component.enableDebug = false;
    component.enableDragAndDrop = true;
    component.expandAll = true;
    component.indent = 15;
    component.selectedNodeIdChanged.subscribe();
    component.selectedNodeChanged.subscribe();
    component.dragStart.subscribe();
    component.dragOver.subscribe();
    component.dragEnd.subscribe();
    component.dragDrop.subscribe();

    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      const rendered = fixture.nativeElement;
      expect(rendered).toMatchSnapshot();
    });
  });

  test('Should be able to start with a node in determined position', () => {
    component.getRoot = () => TreeMockData.dataWithParentId;
    component.getChildren = TestHelper.getChildren;
    component.getBranch = TestHelper.getBranch;
    component.nodeParser = TestHelper.nodeParser2;

    fixture.detectChanges();
    component.branchDetails = {
      nodeId: '6',
      parentId: '4',
      nodeType: 'leaf'
    };
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      const rendered = fixture.nativeElement;
      expect(rendered).toMatchSnapshot();
    });
  });
});
