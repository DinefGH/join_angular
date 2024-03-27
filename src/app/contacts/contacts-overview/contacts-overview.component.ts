import { Component, OnInit } from '@angular/core';
import { AddContactService } from 'src/app/services/add-contact.service';


@Component({
  selector: 'app-contacts-overview',
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss']
})
export class ContactsOverviewComponent implements OnInit  {
  isVisible: boolean = false;
  groupedContacts: { [key: string]: { name: string; initials: string; email: string  }[] } = {};

  showContactsAdd(): void {
    this.isVisible = true; // Show the <app-contacts-add> component
  }

  constructor(private addContactService: AddContactService) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.addContactService.getContacts().subscribe(contacts => {
      this.groupContactsByFirstLetter(contacts);
    });
  }


  groupContactsByFirstLetter(contacts: any[]): void {
    contacts.forEach(contact => {
      const firstLetter = contact.name[0].toUpperCase();
      const initials = this.getInitials(contact.name);
      // Include email in the object
      const contactWithInitialsAndEmail = { ...contact, initials }; // Assuming email is already part of contact
  
      if (!this.groupedContacts[firstLetter]) {
        this.groupedContacts[firstLetter] = [];
      }
      this.groupedContacts[firstLetter].push(contactWithInitialsAndEmail);
    });
  }
  
  getInitials(name: string): string {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    
    return initials;
  }


  getSortedLetters(): string[] {
    return Object.keys(this.groupedContacts).sort();
  }


}


