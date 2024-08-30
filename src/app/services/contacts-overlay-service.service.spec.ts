import { TestBed } from '@angular/core/testing';

import { ContactsOverlayServiceService } from './contacts-overlay-service.service';

describe('ContactsOverlayServiceService', () => {
  let service: ContactsOverlayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsOverlayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
