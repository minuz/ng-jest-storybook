import { TestBed } from '@angular/core/testing';

import { AppLayoutService } from './app-layout.service';

describe('AppLayoutService', () => {
  let service: AppLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AppLayoutService] });
    service = TestBed.get(AppLayoutService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('can hold left sidenav state', () => {
    service.leftSidenavState.subscribe(value => {
      expect(value).toBeTruthy();
    });
    service.toggleLeftSidenav(false);
    service.leftSidenavState.subscribe(value => {
      expect(value).toBeFalsy();
    });
  });
});
