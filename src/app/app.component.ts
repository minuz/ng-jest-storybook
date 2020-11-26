import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AppLayoutService } from '@n4nd0/app-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'n4nd0-ng-playground';
  constructor(public layout: AppLayoutService, public updates: SwUpdate) {}
}
