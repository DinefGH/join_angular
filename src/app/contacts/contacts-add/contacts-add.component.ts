import { Component, EventEmitter, Output  } from '@angular/core';
import { AddContactService } from 'src/app/services/add-contact.service';

@Component({
  selector: 'app-contacts-add',
  templateUrl: './contacts-add.component.html',
  styleUrls: ['./contacts-add.component.scss']
})
export class ContactsAddComponent {

  addContactSuccess = false

  contactData = {
    name: '',
    email: '',
    phone: ''
  };
  @Output() close = new EventEmitter<void>();

  closeComponent() {
    this.close.emit();
  }

  constructor(private addContactService: AddContactService) { }

  submitContactForm() {
    this.addContactService.addContact(this.contactData).subscribe({
      next: (response) => {
        console.log('Contact added successfully:', response);
        this.addContactSuccess = true;
        // Optionally, clear the form or provide user feedback
      },
      error: (error) => {
        console.error('There was an error adding the contact:', error);
        // Optionally, provide user feedback
      }
    });
  }
}
