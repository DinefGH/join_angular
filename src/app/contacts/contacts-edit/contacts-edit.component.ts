import { Component,  EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model'; 

@Component({
  selector: 'app-contacts-edit',
  templateUrl: './contacts-edit.component.html',
  styleUrls: ['./contacts-edit.component.scss']
})
export class ContactsEditComponent implements OnInit {

  contact: Contact = { id: 0, name: '', email: '', phone: '', color: '', initials: '' }; // include `initials` if it's mandatory


  @Output() contactEdited = new EventEmitter<boolean>();

  @Output() close = new EventEmitter<void>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addContactService: AddContactService
  ) {}


  ngOnInit(): void {
    // Assume the contact data is passed in via a service or direct assignment
    this.loadContact();
  }

  loadContact(): void {
    // Example of fetching the contact ID from route parameters
    // Adjust based on your app's logic - e.g., might use a service to get a contact to edit
    const contactId = this.route.snapshot.params['id'];
    if (contactId) {
      this.addContactService.getContactById(contactId).subscribe({
        next: (contactData) => {
          this.contact = contactData;
        },
        error: (err) => console.error(err)
      });
    }
  }

  getInitials(name: string | undefined): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onSubmit(contactForm: NgForm): void {
    console.log(contactForm.value);
    if (this.contact && this.contact.id) {
      this.addContactService.updateContact(this.contact.id, this.contact).subscribe({
        next: (updatedContact) => {
          console.log('Contact updated successfully', updatedContact);
          this.contactEdited.emit(true); // Emit an event to notify that the contact has been edited
          this.closeEditComponent();
        },
        error: (error) => {
          console.error('Failed to update contact', error);
          this.contactEdited.emit(false); // Optionally emit false to indicate failure
        }
      });
    } else {
      console.error('Contact data is incomplete.');
    }
  }


  deleteContact(): void {
    if (this.contact.id) {
      this.addContactService.deleteContact(this.contact.id).subscribe({
        next: () => {
          console.log(`Contact with ID ${this.contact.id} deleted successfully.`);
          this.router.navigate(['/contacts']); // Navigate to the contacts overview page
        },
        error: (error) => {
          console.error(`Failed to delete contact with ID ${this.contact.id}`, error);
          // Handle error, e.g., showing an error message
        }
      });
    } else {
      console.error('Attempted to delete a contact without a valid ID.');
    }
  }



  closeEditComponent() {
    this.close.emit();
  }
}