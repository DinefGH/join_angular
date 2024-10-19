import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ScreenSizeService } from './screen-size.service';
import { of } from 'rxjs';

describe('ScreenSizeService', () => {
  let service: ScreenSizeService;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(() => {
    // Create a spy for BreakpointObserver
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    TestBed.configureTestingModule({
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        ScreenSizeService,
      ],
    });
  });

  it('should be created', () => {
    // Mock the observe method to return a default observable
    mockBreakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} }));

    // Now inject the service after setting up the mock
    service = TestBed.inject(ScreenSizeService);

    expect(service).toBeTruthy(); // Check if the service is instantiated correctly
  });

  it('should emit true when the screen is handset or tablet', (done) => {
    // Mock the observe method to return a state with matches: true
    const mockBreakpointState: BreakpointState = { matches: true, breakpoints: {} };
    mockBreakpointObserver.observe.and.returnValue(of(mockBreakpointState));

    // Inject the service after setting up the mock
    service = TestBed.inject(ScreenSizeService);

    service.isHandsetOrTablet$.subscribe((isHandsetOrTablet) => {
      expect(isHandsetOrTablet).toBeTrue(); // Expect true when matches is true
      done(); // Call done to finish the async test
    });
  });

  it('should emit false when the screen is not handset or tablet', (done) => {
    // Mock the observe method to return a state with matches: false
    const mockBreakpointState: BreakpointState = { matches: false, breakpoints: {} };
    mockBreakpointObserver.observe.and.returnValue(of(mockBreakpointState));

    // Inject the service after setting up the mock
    service = TestBed.inject(ScreenSizeService);

    service.isHandsetOrTablet$.subscribe((isHandsetOrTablet) => {
      expect(isHandsetOrTablet).toBeFalse(); // Expect false when matches is false
      done(); // Call done to finish the async test
    });
  });
});
