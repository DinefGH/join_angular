import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsViewComponent } from './contacts-view.component';
import { AddContactService } from 'src/app/services/add-contact.service';
import { ContactsOverlayService } from 'src/app/services/contacts-overlay-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Contact } from 'src/assets/models/contact.model';

describe('ContactsViewComponent', () => {
  let component: ContactsViewComponent;
  let fixture: ComponentFixture<ContactsViewComponent>;
  let addContactService: jasmine.SpyObj<AddContactService>;
  let contactsOverlayService: jasmine.SpyObj<ContactsOverlayService>;
  let router: jasmine.SpyObj<Router>;

  const mockContact: Contact = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    color: '#123456',
    initials: 'JD',
  };

  beforeEach(async () => {
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['getContactById', 'deleteContact']);
    const contactsOverlayServiceSpy = jasmine.createSpyObj('ContactsOverlayService', ['setOverlayVisibility']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = {
      params: of({ id: 1 }),
    };

    await TestBed.configureTestingModule({
      declarations: [ContactsViewComponent],
      providers: [
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: ContactsOverlayService, useValue: contactsOverlayServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore errors related to unknown components in the template
    }).compileComponents();

    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;
    contactsOverlayService = TestBed.inject(ContactsOverlayService) as jasmine.SpyObj<ContactsOverlayService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ContactsViewComponent);
    component = fixture.componentInstance;

    addContactService.getContactById.and.returnValue(of(mockContact)); // Mock getting contact details
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contact details on init when contactId is provided', () => {
    component.contactId = 1;
    component.ngOnInit();
    expect(addContactService.getContactById).toHaveBeenCalledWith(1);
    expect(component.contact).toEqual(mockContact);
  });

  it('should handle route parameters and load contact details', () => {
    expect(addContactService.getContactById).toHaveBeenCalledWith(1);
    expect(component.contact).toEqual(mockContact);
  });

  it('should handle changes in contactId input and reload contact details', () => {
    const changes = {
      contactId: {
        currentValue: 2,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    };
    const newMockContact: Contact = { ...mockContact, id: 2, name: 'Jane Doe' };
    addContactService.getContactById.and.returnValue(of(newMockContact));

    component.ngOnChanges(changes);
    expect(addContactService.getContactById).toHaveBeenCalledWith(2);
    expect(component.contact).toEqual(newMockContact);
  });

  it('should delete contact and navigate to contacts overview', () => {
    addContactService.deleteContact.and.returnValue(of({}));
    spyOn(component.contactDeleted, 'emit');

    component.contact = mockContact;
    component.deleteContact();

    expect(addContactService.deleteContact).toHaveBeenCalledWith(mockContact.id);
    expect(router.navigate).toHaveBeenCalledWith(['/contacts']);
    expect(component.contactDeleted.emit).toHaveBeenCalled();
    expect(contactsOverlayService.setOverlayVisibility).toHaveBeenCalledWith(false);
  });

  it('should handle delete contact error', () => {
    addContactService.deleteContact.and.returnValue(throwError('Failed to delete contact'));
    spyOn(console, 'error');

    component.contact = mockContact;
    component.deleteContact();

    expect(addContactService.deleteContact).toHaveBeenCalledWith(mockContact.id);
    expect(console.error).toHaveBeenCalledWith('Failed to delete contact', 'Failed to delete contact');
  });

  it('should show the edit overlay when showContactsEdit is called', () => {
    component.contact = mockContact;
    component.showContactsEdit();

    expect(component.showEditOverlay).toBeTrue();
  });

  it('should handle contact edit success and reload contact details', () => {
    addContactService.getContactById.and.returnValue(of(mockContact));
    spyOn(component.contactUpdated, 'emit');

    component.contact = mockContact;
    component.onContactEdited(true);

    expect(addContactService.getContactById).toHaveBeenCalledWith(mockContact.id);
    expect(component.contactUpdated.emit).toHaveBeenCalled();
    expect(component.showEditOverlay).toBeFalse();
  });

  it('should handle contact edit failure', () => {
    spyOn(console, 'log');

    component.onContactEdited(false);

    expect(console.log).toHaveBeenCalledWith('Contact edit was not successful.');
  });

  it('should navigate back to contacts when goBackToContacts is called', () => {
    component.goBackToContacts();

    expect(router.navigate).toHaveBeenCalledWith(['/contacts']);
  });

  it('should get initials from the contact name', () => {
    const initials = component.getInitials('John Doe');
    expect(initials).toBe('JD');
  });
});
