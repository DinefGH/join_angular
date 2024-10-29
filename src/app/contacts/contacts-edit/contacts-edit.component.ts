import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';


/**
 * Component for editing contact details. Allows updating and deleting contact information.
 * Emits events when a contact is successfully edited or when the edit form is closed.
 */
@Component({
  selector: 'app-contacts-edit',
  templateUrl: './contacts-edit.component.html',
  styleUrls: ['./contacts-edit.component.scss'],
})
export class ContactsEditComponent implements OnInit {

    /** ID of the contact to be edited, can be provided as input. */
  @Input() contactId: number | null = null;

    /** Contact model for holding the contact's details. */
  contact: Contact = { id: 0, name: '', email: '', phone: '', color: '', initials: '' }; // include `initials` if it's mandatory

    /** Event emitted when a contact is successfully edited, passing a boolean value. */
  @Output() contactEdited = new EventEmitter<boolean>();

    /** Event emitted when the edit component is closed. */
  @Output() close = new EventEmitter<void>();


    /**
   * Constructor to inject necessary services for managing contact data and navigation.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router - Angular Router for navigation.
   * @param addContactService - Service for managing contact data.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addContactService: AddContactService,
  ) {}


    /**
   * Initializes the component by loading the contact information based on the provided contact ID.
   */
  ngOnInit(): void {
    this.loadContact();
  }


    /**
   * Loads the contact data by ID from the service.
   * If no `contactId` is provided, it tries to load the ID from route parameters.
   */
  loadContact(): void {
    const contactId = this.contactId !== null ? this.contactId : this.route.snapshot.params['id'];
    if (contactId) {
      this.addContactService.getContactById(contactId).subscribe({
        next: contactData => {
          this.contact = contactData;
        },
        error: err => console.error(err),
      });
    }
  }


    /**
   * Generates initials from the contact's name for display.
   * @param name - The name of the contact.
   * @returns The initials derived from the contact's name.
   */
  getInitials(name: string | undefined): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }


  /**
   * Submits the updated contact data to the service.
   * Emits an event on successful update or failure.
   * @param contactForm - The form containing contact data.
   */
  onSubmit(contactForm: NgForm): void {
    if (this.contact && this.contact.id) {
      this.addContactService.updateContact(this.contact.id, this.contact).subscribe({
        next: updatedContact => {
          this.contactEdited.emit(true); 
          this.closeEditComponent();
        },
        error: error => {
          console.error('Failed to update contact', error);
          this.contactEdited.emit(false); 
        },
      });
    } else {
      console.error('Contact data is incomplete.');
    }
  }


    /**
   * Deletes the contact using the service and navigates to the contact list.
   */
  deleteContact(): void {
    if (this.contact.id) {
      this.addContactService.deleteContact(this.contact.id).subscribe({
        next: () => {
          this.router.navigate(['/contacts']); 
        },
        error: error => {
          console.error(`Failed to delete contact with ID ${this.contact.id}`, error);
        },
      });
    } else {
      console.error('Attempted to delete a contact without a valid ID.');
    }
  }


    /**
   * Closes the edit component and emits a close event.
   */
  closeEditComponent() {
    this.close.emit();
  }
}
