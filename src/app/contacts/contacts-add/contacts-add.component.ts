import { Component, EventEmitter, Output } from '@angular/core';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Router } from '@angular/router';


/**
 * Component for adding new contacts. Manages contact form data and submission.
 * Emits events when a contact is successfully added or when the form is closed.
 */
@Component({
  selector: 'app-contacts-add',
  templateUrl: './contacts-add.component.html',
  styleUrls: ['./contacts-add.component.scss'],
})
export class ContactsAddComponent {

    /** Flag indicating if a contact has been successfully added. */
  addContactSuccess = false;

    /** Data model for storing contact information from the form. */
  contactData = {
    name: '',
    email: '',
    phone: '',
    color: '',
  };

    /** Event emitted when a contact is successfully added, passing a boolean value. */
  @Output() contactAdded = new EventEmitter<boolean>();

    /** Event emitted when the contact add component is closed. */
  @Output() close = new EventEmitter<void>();


    /**
   * Constructor to inject services for contact management and navigation.
   * @param addContactService - Service for adding contacts.
   * @param router - Angular Router for navigation.
   */
  constructor(
    private addContactService: AddContactService,
    private router: Router,
  ) {}


    /**
   * Submits the contact form data to add a new contact.
   * Generates a random dark color if none is provided, then emits events on success.
   */
  submitContactForm() {
    if (!this.contactData.color) {
      this.contactData.color = this.generateRandomDarkColor();
    }
    this.addContactService.addContact(this.contactData).subscribe({
      next: response => {
        this.addContactSuccess = true;

        this.contactAdded.emit(true);
        setTimeout(() => {
          this.close.emit();
        }, 3000);
      },
      error: error => {
        console.error('There was an error adding the contact:', error);
      },
    });
  }


    /**
   * Generates a random dark color in HEX format.
   * @returns A hex color string with dark RGB values.
   */
  generateRandomDarkColor(): string {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return (
      '#' +
      [r, g, b]
        .map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }


    /**
   * Emits the close event to signal that the component should be closed.
   */
  closeComponent() {
    this.close.emit();
  }
}
