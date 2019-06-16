import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppLayoutService {
  private _leftSidenavState = new BehaviorSubject<boolean>(true);
  private _rightSidenavState = new BehaviorSubject<boolean>(false);

  get leftSidenavState() {
    return this._leftSidenavState.asObservable();
  }

  get rightSidenavState() {
    return this._rightSidenavState.asObservable();
  }

  toggleLeftSidenav(value?: boolean) {
    if (value !== null && value !== undefined) {
      this._leftSidenavState.next(value);
    } else {
      this._leftSidenavState.next(!this._leftSidenavState.value);
    }
  }

  toggleRightSidenav(value?: boolean) {
    if (value !== null && value !== undefined) {
      this._rightSidenavState.next(value);
    } else {
      this._rightSidenavState.next(!this._rightSidenavState.value);
    }
  }
}
