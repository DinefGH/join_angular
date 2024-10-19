import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsAddComponent } from './contacts-add.component';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngForm
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContactsAddComponent', () => {
  let component: ContactsAddComponent;
  let fixture: ComponentFixture<ContactsAddComponent>;
  let addContactService: jasmine.SpyObj<AddContactService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const addContactServiceSpy = jasmine.createSpyObj('AddContactService', ['addContact']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule], // Include FormsModule for template-driven forms
      declarations: [ContactsAddComponent],
      providers: [
        { provide: AddContactService, useValue: addContactServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore child component errors in the template
    }).compileComponents();

    addContactService = TestBed.inject(AddContactService) as jasmine.SpyObj<AddContactService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ContactsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a random dark color', () => {
    const color = component.generateRandomDarkColor();
    expect(color).toMatch(/^#[0-9a-f]{6}$/); // Validates hex color format
  });


  it('should submit the contact form and emit contactAdded on success', () => {
    const mockContactResponse = { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', color: '#123456' };
    addContactService.addContact.and.returnValue(of(mockContactResponse));
  
    spyOn(component.contactAdded, 'emit');
    spyOn(component.close, 'emit');
  
    component.contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      color: '#123456'
    };
  
    component.submitContactForm();
  
    expect(addContactService.addContact).toHaveBeenCalledWith(component.contactData);
    expect(component.addContactSuccess).toBeTrue();
    expect(component.contactAdded.emit).toHaveBeenCalledWith(true);
  
    // Ensure the close event is emitted after a delay
    setTimeout(() => {
      expect(component.close.emit).toHaveBeenCalled();
    }, 3000);
  });


  it('should handle errors during contact submission', () => {
    const mockError = { message: 'Error adding contact' };
    addContactService.addContact.and.returnValue(throwError(mockError));
  
    spyOn(console, 'error');
    component.submitContactForm();
  
    expect(addContactService.addContact).toHaveBeenCalledWith(component.contactData);
    expect(console.error).toHaveBeenCalledWith('There was an error adding the contact:', mockError);
  });


  it('should emit the close event when closeComponent is called', () => {
    spyOn(component.close, 'emit');
    component.closeComponent();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
