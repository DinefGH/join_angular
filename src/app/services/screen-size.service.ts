import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  // Define custom breakpoints
  private handsetOrTabletBreakpoints = [
    Breakpoints.Handset,
    '(max-width: 1024px)', // Adjust this to match tablet size (1024px for iPad Air)
  ];

  isHandsetOrTablet$: Observable<boolean> = this.breakpointObserver
    .observe(this.handsetOrTabletBreakpoints)
    .pipe(map((state: BreakpointState) => state.matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
