import { TestBed } from '@angular/core/testing';
import { ContactsOverlayService } from './contacts-overlay-service.service';


describe('ContactsOverlayService', () => {
  let service: ContactsOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactsOverlayService],
    });
    service = TestBed.inject(ContactsOverlayService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have overlay visibility set to false', () => {
    // Test the initial value of overlayVisibility$
    service.overlayVisibility$.subscribe((isVisible) => {
      expect(isVisible).toBeFalse(); // Initially, it should be false
    });

    // Test the initial value of getOverlayVisibility
    expect(service.getOverlayVisibility()).toBeFalse();
  });

  it('should set and get overlay visibility correctly', () => {
    // Set the overlay visibility to true
    service.setOverlayVisibility(true);

    // Test the updated value of overlayVisibility$
    service.overlayVisibility$.subscribe((isVisible) => {
      expect(isVisible).toBeTrue(); // It should now be true
    });

    // Test the updated value of getOverlayVisibility
    expect(service.getOverlayVisibility()).toBeTrue();

    // Set the overlay visibility back to false
    service.setOverlayVisibility(false);

    // Test the updated value of overlayVisibility$
    service.overlayVisibility$.subscribe((isVisible) => {
      expect(isVisible).toBeFalse(); // It should now be false again
    });

    // Test the updated value of getOverlayVisibility
    expect(service.getOverlayVisibility()).toBeFalse();
  });
});
