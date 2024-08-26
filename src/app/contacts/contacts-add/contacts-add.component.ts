import { Component, EventEmitter, Output  } from '@angular/core';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Router } from '@angular/router';

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
    phone: '',
    color: '' 
  };

  @Output() contactAdded = new EventEmitter<boolean>();

  @Output() close = new EventEmitter<void>();


  constructor(private addContactService: AddContactService, private router: Router) { }

  submitContactForm() {
    if (!this.contactData.color) {
      this.contactData.color = this.generateRandomDarkColor();
    }
    this.addContactService.addContact(this.contactData).subscribe({
      next: (response) => {
        this.addContactSuccess = true;

        this.contactAdded.emit(true);
        setTimeout(() => {
          this.close.emit(); // Navigate to the login page
        }, 3000);
      },
      error: (error) => {
        console.error('There was an error adding the contact:', error);
        // Optionally, provide user feedback
      }
    });
  }
  generateRandomDarkColor(): string {
    // Generates a dark color in HEX format
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  closeComponent() {
    this.close.emit();
  }
}
