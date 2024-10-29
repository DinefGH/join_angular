import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsOverviewComponent } from './contacts-overview.component';
import { AddContactService } from 'src/app/services/add-contact.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { ContactsOverlayService } from 'src/app/services/contacts-overlay-service.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Contact } from 'src/assets/models/contact.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContactsOverviewComponent', () => {
  let component: ContactsOverviewComponent;
  let fixture: ComponentFixture<ContactsOverviewComponent>;
  let addContactService: jasmine.SpyObj<AddContactService>;
  let screenSizeService: jasmine.SpyObj<ScreenSizeService>;
  let contactsOverlayService: jasmine.SpyObj<ContactsOverlayService>;
  let router: jasmine.SpyObj<Router>;

  const mockContacts: Contact[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      color: '#123456',
      initials: 'JD',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      color: '#654321',
      initials: 'JS',
    },
  ];

  beforeEach(async () => {
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['getContacts']);
    const screenSizeServiceSpy = jasmine.createSpyObj('ScreenSizeService', ['isHandsetOrTablet$']);
    const contactsOverlayServiceSpy = jasmine.createSpyObj('ContactsOverlayService', [
      'setOverlayVisibility',
      'overlayVisibility$',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ContactsOverviewComponent],
      providers: [
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: ScreenSizeService, useValue: screenSizeServiceSpy },
        { provide: ContactsOverlayService, useValue: contactsOverlayServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore errors related to unknown components in the template
    }).compileComponents();

    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;
    screenSizeService = TestBed.inject(ScreenSizeService) as jasmine.SpyObj<ScreenSizeService>;
    contactsOverlayService = TestBed.inject(
      ContactsOverlayService,
    ) as jasmine.SpyObj<ContactsOverlayService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ContactsOverviewComponent);
    component = fixture.componentInstance;

    addContactService.getContacts.and.returnValue(of(mockContacts));
    screenSizeService.isHandsetOrTablet$ = of(false); // Mock as a desktop device
    contactsOverlayService.overlayVisibility$ = of(false); // Mock initial overlay visibility

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts and group them by the first letter on init', () => {
    component.loadContacts();
    fixture.detectChanges();

    expect(addContactService.getContacts).toHaveBeenCalled();
    expect(component.groupedContacts['J'].length).toBe(2); // Both John Doe and Jane Smith
    expect(component.groupedContacts['J'][0].name).toBe('Jane Smith');
    expect(component.groupedContacts['J'][1].name).toBe('John Doe');
  });

  it('should handle contact loading errors', () => {
    addContactService.getContacts.and.returnValue(throwError('Error loading contacts'));
    spyOn(console, 'error');

    component.loadContacts();
    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading contacts:', 'Error loading contacts');
  });

  it('should get initials for a contact name', () => {
    const initials = component.getInitials('John Doe');
    expect(initials).toBe('JD');
  });

  it('should navigate to contact details on handset or tablet', () => {
    component.isHandsetOrTablet = true; // Simulate a handset or tablet
    component.openContact(1);

    expect(router.navigate).toHaveBeenCalledWith(['/contacts-detail', 1]);
  });

  it('should open desktop contact details on non-handset devices', () => {
    component.isHandsetOrTablet = false; // Simulate a desktop
    component.groupContactsByFirstLetter(mockContacts); // Group contacts
    component.openContact(1);

    expect(component.selectedContact?.id).toBe(1);
    expect(contactsOverlayService.setOverlayVisibility).toHaveBeenCalledWith(true);
  });

  it('should handle closing the contacts view', () => {
    spyOn(console, 'log');
    component.closeContactsView();

    expect(console.log).toHaveBeenCalledWith('Closing contacts view...');
    expect(contactsOverlayService.setOverlayVisibility).toHaveBeenCalledWith(false);
  });

  it('should refresh contacts when a contact is added', () => {
    spyOn(component, 'loadContacts');
    component.onContactAdded(true); // Simulate contact added

    expect(component.loadContacts).toHaveBeenCalled();
  });

  it('should not refresh contacts when no contact is added', () => {
    spyOn(component, 'loadContacts');
    component.onContactAdded(false); // Simulate no contact added

    expect(component.loadContacts).not.toHaveBeenCalled();
  });

  it('should group contacts by the first letter and sort them alphabetically', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', color: '#FF0000' },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        color: '#00FF00',
      },
    ];

    // Call the grouping function
    component.groupContactsByFirstLetter(mockContacts);

    // Check that contacts are grouped under 'J'
    expect(Object.keys(component.groupedContacts).length).toBe(1); // Only one letter 'J'
    expect(component.groupedContacts['J'].length).toBe(2); // Both John Doe and Jane Smith

    // Check that they are sorted alphabetically by name
    expect(component.groupedContacts['J'][0].name).toBe('Jane Smith'); // Jane should come before John
    expect(component.groupedContacts['J'][1].name).toBe('John Doe');
  });
});
