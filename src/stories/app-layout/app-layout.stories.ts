import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLayoutComponent, AppLayoutService } from '@n4nd0/app-layout';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withKnobs, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('Layout', module);
stories.addDecorator(withKnobs);
stories.addDecorator(
  moduleMetadata({
    declarations: [AppLayoutComponent],
    imports: [BrowserAnimationsModule, MatSidenavModule, MatToolbarModule],
    providers: [AppLayoutService]
  })
);
stories.add('expanded', () => ({
  template: `
    <n4nd0-app-layout [toggleLeftSidenav]="toggleLeftSidenav" [toggleRightSidenav]="toggleRightSidenav">
      <div toolbar>Should show toolbar content</div>
      <div left-sidenav>Should display something on left sidenav</div>
      <div main-content>Should display something as main content</div>
      <div right-sidenav>Should display something as right sidenav</div>
    </n4nd0-app-layout>`,
  props: {
    toggleLeftSidenav: boolean('toggle left sidenav', true),
    toggleRightSidenav: boolean('toggle right sidenav', true)
  }
}));
