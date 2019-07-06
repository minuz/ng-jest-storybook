import { Component, Input } from '@angular/core';

import { AppLayoutService } from './app-layout.service';

@Component({
  selector: 'n4nd0-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  @Input() set toggleLeftSidenav(value: boolean) {
    this.layout.toggleLeftSidenav(value);
  }

  @Input() set toggleRightSidenav(value: boolean) {
    this.layout.toggleRightSidenav(value);
  }

  constructor(public layout: AppLayoutService) {}
}
