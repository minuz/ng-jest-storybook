import { withTests } from '@storybook/addon-jest';
import { storiesOf } from '@storybook/angular';
import { Welcome } from '@storybook/angular/demo';
import { HelloComponent } from 'hello';

import results from '../../coverage/jest-test-results.json';

storiesOf('Welcome', module).add('to Storybook', () => ({
  component: Welcome,
  props: {}
}));

storiesOf('Hello Lib', module)
  .addDecorator(
    withTests({ results, filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$' })
  )
  .add(
    'Simple Hello',
    () => ({
      moduleMetadata: {
        declarations: [HelloComponent]
      },
      template: `<lib-hello></lib-hello>`,
      props: {}
    }),
    { jest: ['hello.component.spec.ts', 'app.component.spec.ts'] }
  );
