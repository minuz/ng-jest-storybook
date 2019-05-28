import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import results from '../../coverage/lib/jest-test-results.json';
import { withTests } from '@storybook/addon-jest';
import { Welcome, Button } from '@storybook/angular/demo';

import { HelloComponent } from 'hello';

storiesOf('Welcome', module).add('to Storybook', () => ({
  component: Welcome,
  props: {}
}));

storiesOf('Hello Lib', module)
  .addDecorator(
    withTests({ results, filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$' })
  )
  .addParameters({ jest: ['HelloComponent'] }) // Doesn't work either.
  // .add('Simple Hello', () => ({ component: HelloComponent, props: {} }), {
  //   jest: ['hello.component']
  // }); // Doesn't work as well
  .add(
    'Simple Hello',
    () => ({
      moduleMetadata: {
        declarations: [HelloComponent]
      },
      template: `<lib-hello></lib-hello>`,
      props: {}
    }),
    { jest: ['HelloComponent'] }
  );
