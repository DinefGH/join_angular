import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsEditComponent } from './contacts-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms'; // For handling form submission
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Contact } from 'src/assets/models/contact.model';

describe('ContactsEditComponent', () => {
  let component: ContactsEditComponent;
  let fixture: ComponentFixture<ContactsEditComponent>;
  let addContactService: jasmine.SpyObj<AddContactService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockContact: Contact = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    color: '#123456',
    initials: 'JD',
  };

  beforeEach(async () => {
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', [
      'getContactById',
      'updateContact',
      'deleteContact',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule], // Import FormsModule to work with NgForm
      declarations: [ContactsEditComponent],
      providers: [
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore child component errors in the template
    }).compileComponents();

    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    // Ensure getContactById returns an observable with mockContact
    addContactService.getContactById.and.returnValue(of(mockContact));

    fixture = TestBed.createComponent(ContactsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contact on initialization', () => {
    expect(addContactService.getContactById).toHaveBeenCalledWith(1);
    expect(component.contact).toEqual(mockContact); // Check if the contact is loaded properly
  });

  it('should load contact data on init', () => {
    addContactService.getContactById.and.returnValue(of(mockContact));
    component.loadContact();
    fixture.detectChanges();

    expect(component.contact).toEqual(mockContact);
    expect(addContactService.getContactById).toHaveBeenCalledWith(1); // Ensure the contact ID is passed correctly
  });

  it('should update the contact and emit the contactEdited event', () => {
    addContactService.updateContact.and.returnValue(of(mockContact));

    spyOn(component.contactEdited, 'emit');
    spyOn(component, 'closeEditComponent');

    component.contact = mockContact; // Assign mock contact
    component.onSubmit({} as any); // Simulate form submission

    expect(addContactService.updateContact).toHaveBeenCalledWith(mockContact.id, mockContact);
    expect(component.contactEdited.emit).toHaveBeenCalledWith(true);
    expect(component.closeEditComponent).toHaveBeenCalled();
  });

  it('should handle update contact error and emit false for contactEdited event', () => {
    addContactService.updateContact.and.returnValue(throwError('Failed to update contact'));

    spyOn(component.contactEdited, 'emit');

    component.contact = mockContact; // Assign mock contact
    component.onSubmit({} as any); // Simulate form submission

    expect(addContactService.updateContact).toHaveBeenCalledWith(mockContact.id, mockContact);
    expect(component.contactEdited.emit).toHaveBeenCalledWith(false);
  });

  it('should delete the contact and navigate to contacts overview page', () => {
    addContactService.deleteContact.and.returnValue(of({}));

    component.contact = mockContact;
    component.deleteContact();

    expect(addContactService.deleteContact).toHaveBeenCalledWith(mockContact.id);
    expect(router.navigate).toHaveBeenCalledWith(['/contacts']);
  });

  it('should handle delete contact error', () => {
    addContactService.deleteContact.and.returnValue(throwError('Failed to delete contact'));

    spyOn(console, 'error');
    component.contact = mockContact;
    component.deleteContact();

    expect(addContactService.deleteContact).toHaveBeenCalledWith(mockContact.id);
    expect(console.error).toHaveBeenCalledWith(
      `Failed to delete contact with ID ${mockContact.id}`,
      'Failed to delete contact',
    );
  });

  it('should emit close event when closeEditComponent is called', () => {
    spyOn(component.close, 'emit');

    component.closeEditComponent();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
