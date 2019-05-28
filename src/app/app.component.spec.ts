import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HelloModule } from 'hello';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HelloModule],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  test(`should have as title 'ng-jest-storybook'`, () => {
    expect(component.title).toEqual('ng-jest-storybook');
  });

  test('should render title in a h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to ng-jest-storybook!'
    );
  });

  test(`should render 'hello works!'`, () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p#lib-hello').textContent).toContain(
      'hello works!'
    );
  });
});
