import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLayoutComponent } from './app-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppLayoutService } from './app-layout.service';

describe('AppLayoutComponent', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;
  let service: AppLayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppLayoutComponent],
      imports: [BrowserAnimationsModule, MatSidenavModule, MatToolbarModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('layout functionality', () => {
    beforeEach(async () => {
      service = component.layout;
    });

    test('Should be able to close left sidenav', () => {
      service.toggleLeftSidenav(false);
      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });
});
