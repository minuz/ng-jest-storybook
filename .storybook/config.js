import { configure, addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { addParameters } from '@storybook/angular';
import theme from './theme';
// Option defaults.
addParameters({
  options: {
    theme: theme,
    addonPanelInRight: true
  }
});

addDecorator(withKnobs);

function loadStories() {
  require('../projects/stories/index.stories.ts');

  // automatically import all files ending in *.stories.ts
  const req = require.context('../projects/stories', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
