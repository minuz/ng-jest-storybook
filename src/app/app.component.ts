import { Component } from '@angular/core';
import { AppLayoutService } from '@lumen/app-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-jest-storybook';
  constructor(public layout: AppLayoutService) {}
}
