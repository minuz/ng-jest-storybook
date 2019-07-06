import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function toConsole(msg: string, isDebug: boolean) {
  if (isDebug) {
    console.log(msg);
  }
}

export function consoleDebug(msg: string, data: any, isDebug: boolean) {
  if (isDebug) {
    console.log(msg, data);
  }
}

/*
   * Custom Pipe operator to add console msg based on the debug flag.
   * Use it within the pipe for Observables.
   */
export function debug(msg: string, isDebug: boolean) {
  return (source: Observable<any>) => {
    return source.pipe(tap((data) => consoleDebug(msg, data, isDebug)));
  };
}
