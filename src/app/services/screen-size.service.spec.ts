import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ScreenSizeService } from './screen-size.service';
import { of } from 'rxjs';

describe('ScreenSizeService', () => {
  let service: ScreenSizeService;
  let breakpointObserver: BreakpointObserver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenSizeService,
        {
          provide: BreakpointObserver,
          useValue: {
            observe: jasmine.createSpy('observe')
          }
        }
      ]
    });

    service = TestBed.inject(ScreenSizeService); // Inject the service
    breakpointObserver = TestBed.inject(BreakpointObserver); // Inject the mocked BreakpointObserver
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Ensure the service is created
  });

  it('should emit true for handset or tablet screen sizes', (done: DoneFn) => {
    // Mock the BreakpointObserver to return a matching state (handset or tablet)
    (breakpointObserver.observe as jasmine.Spy).and.returnValue(
      of({ matches: true } as BreakpointState)
    );

    // Subscribe to the observable and verify it emits true
    service.isHandsetOrTablet$.subscribe((isHandsetOrTablet) => {
      expect(isHandsetOrTablet).toBeTrue();
      done();
    });
  });

  it('should emit false for larger screen sizes', (done: DoneFn) => {
    // Mock the BreakpointObserver to return a non-matching state (larger screens)
    (breakpointObserver.observe as jasmine.Spy).and.returnValue(
      of({ matches: false } as BreakpointState)
    );

    // Subscribe to the observable and verify it emits false
    service.isHandsetOrTablet$.subscribe((isHandsetOrTablet) => {
      expect(isHandsetOrTablet).toBeFalse();
      done();
    });
  });
});
