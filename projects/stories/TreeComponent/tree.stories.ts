import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatTreeModule
} from '@angular/material';
import { TreeMockData, TreeviewComponent } from '@n4nd0/tree-control';
import {
  OverviewModule,
  withOverview
} from '@south-paw/storybook-addon-overview-angular';
import { withTests } from '@storybook/addon-jest';
import { boolean, number, object, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';

import results from '../../../coverage/jest-test-results.json';
import typedoc from '../../../projects/n4nd0/tree-control/typedoc.json';
import { TreeProps, TreeStoryHelper, TreeTemplates } from './tree.story.helper';

// Init the tree component stories
const stories = storiesOf('TreeComponent', module);
stories.addDecorator(withTests({ results }));
stories.addDecorator(withOverview(typedoc));
stories.addDecorator(withKnobs);
stories.addDecorator(
  moduleMetadata({
    imports: [
      CommonModule,
      MatButtonModule,
      MatTreeModule,
      MatIconModule,
      OverviewModule
    ],
    declarations: [TreeviewComponent]
  })
);

stories.add(
  'Mininum setup',
  () => ({
    template: TreeTemplates.minimum,
    props: TreeProps.minimum
  }),
  {
    overview: {
      ...TreeStoryHelper.componentOverview,
      showInputs: false,
      showOutputs: false
    }
  }
);

stories.add(
  'Minimum setup with drag and drop',
  () => ({
    template: TreeTemplates.dragdrop,
    props: TreeProps.dragdrop
  }),
  {
    overview: TreeStoryHelper.componentOverview
  }
);

stories.add(
  'Can restrict drag and drop levels',
  () => ({
    template: TreeTemplates.dragdrop,
    props: {
      ...TreeProps.dragdrop,
      canDrop: TreeStoryHelper.restricDrop2Levels
    }
  }),
  {
    overview: TreeStoryHelper.componentOverview,
    showInputs: false,
    showOutputs: false
  }
);

stories.add(
  'Start with a node in a determined position',
  () => ({
    template: TreeTemplates.complete,
    props: {
      ...TreeProps.complete,
      nodeParser: TreeStoryHelper.nodeParser2,
      getRoot: () => TreeMockData.dataWithParentId,
      enableDebug: boolean('enableDebug', false),
      enableDragAndDrop: boolean('enableDragAndDrop', false),
      expandAll: boolean('expandAll', false),
      indent: number('indent', 20),
      branchDetails: object('branch details', {
        nodeId: '6',
        parentId: '4',
        nodeType: 'leaf'
      })
    }
  }),
  {
    jest: TreeStoryHelper.componentTests,
    overview: TreeStoryHelper.componentOverview
  }
);

stories.add(
  'Complete implementation',
  () => ({
    template: TreeTemplates.complete,
    props: {
      ...TreeProps.complete,
      enableDebug: boolean('enableDebug', false),
      enableDragAndDrop: boolean('enableDragAndDrop', false),
      expandAll: boolean('expandAll', false),
      indent: number('indent', 20)
    }
  }),
  {
    jest: TreeStoryHelper.componentTests,
    overview: TreeStoryHelper.componentOverview
  }
);
