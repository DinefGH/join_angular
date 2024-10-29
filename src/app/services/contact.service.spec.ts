import { TestBed } from '@angular/core/testing';
import { ContactService } from './contact.service'; // Adjust the path as necessary
import { Contact } from 'src/assets/models/contact.model'; // Adjust the path as necessary

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactService],
    });
    service = TestBed.inject(ContactService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when no contact is set initially', () => {
    // Subscribe to the getContactToEdit() observable
    service.getContactToEdit().subscribe(contact => {
      expect(contact).toBeNull(); // Expect null since no contact has been set yet
    });
  });

  it('should set and get contact correctly', () => {
    const mockContact: Contact = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      initials: '',
      color: '',
    };

    // Set the contact before subscribing
    service.setContactToEdit(mockContact);

    // Subscribe to the getContactToEdit() observable
    service.getContactToEdit().subscribe(contact => {
      expect(contact).toEqual(mockContact); // Ensure the contact matches what was set
    });
  });
});
