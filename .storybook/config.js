import { configure } from '@storybook/angular';
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

function loadStories() {
  require('../src/stories/index.stories.ts');

  // automatically import all files ending in *.stories.ts
  const req = require.context('../src/stories', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
