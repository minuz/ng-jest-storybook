import { Component, OnInit } from '@angular/core';
import { AppLayoutService } from '@n4nd0/app-layout';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-jest-storybook';
  constructor(public layout: AppLayoutService, public updates: SwUpdate) {}

  ngOnInit() {}
}
