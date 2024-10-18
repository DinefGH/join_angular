import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddContactService } from './add-contact.service';
import { HttpHeaders } from '@angular/common/http';

describe('AddContactService', () => {
  let service: AddContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [AddContactService],
    });

    service = TestBed.inject(AddContactService);
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController
  });

  afterEach(() => {
    // Verify that no outstanding HTTP requests are left
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to add a contact', () => {
    const mockContactData = { name: 'John Doe', email: 'john.doe@example.com' };

    service.addContact(mockContactData).subscribe(response => {
      expect(response).toEqual(mockContactData);
    });

    // Set expectations for the HttpClient mock
    const req = httpMock.expectOne(`${service['baseUrl']}/addcontact/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toContain('Token');
    req.flush(mockContactData); // Respond with mock data
  });

  it('should send GET request to retrieve contacts', () => {
    const mockContacts = [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }];

    service.getContacts().subscribe(contacts => {
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/addcontact/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toContain('Token');
    req.flush(mockContacts);
  });

  it('should send GET request to retrieve a contact by ID', () => {
    const mockContact = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    const contactId = 1;

    service.getContactById(contactId).subscribe(contact => {
      expect(contact).toEqual(mockContact);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/contact/${contactId}/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toContain('Token');
    req.flush(mockContact);
  });

  it('should send DELETE request to delete a contact by ID', () => {
    const contactId = 1;

    service.deleteContact(contactId).subscribe(response => {
      expect(response).toEqual(null);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/contact/${contactId}/`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toContain('Token');
    req.flush(null); // Simulate delete success response
  });

  it('should send PUT request to update a contact by ID', () => {
    const mockContactData = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    const contactId = 1;

    service.updateContact(contactId, mockContactData).subscribe(response => {
      expect(response).toEqual(mockContactData);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/contact/${contactId}/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toContain('Token');
    req.flush(mockContactData); // Respond with mock updated data
  });
});
