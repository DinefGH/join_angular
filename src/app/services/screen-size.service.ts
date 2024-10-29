import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * ScreenSizeService provides an observable to detect screen size changes,
 * specifically for identifying handset or tablet devices based on custom breakpoints.
 */
@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {

  /** Custom breakpoints that define handset or tablet screen sizes. */
  private handsetOrTabletBreakpoints = [
    Breakpoints.Handset,
    '(max-width: 1024px)',
  ];


  /**
   * Observable that emits a boolean indicating if the screen size matches
   * the handset or tablet breakpoints.
   */
  isHandsetOrTablet$: Observable<boolean> = this.breakpointObserver
    .observe(this.handsetOrTabletBreakpoints)
    .pipe(map((state: BreakpointState) => state.matches));


    /**
   * Constructor to inject the BreakpointObserver, which observes screen size changes.
   * @param breakpointObserver - Angular CDK BreakpointObserver for monitoring screen size.
   */
  constructor(private breakpointObserver: BreakpointObserver) {}
}
