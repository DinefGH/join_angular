import { Component, OnInit } from '@angular/core';
import { AddContactService } from 'src/app/services/add-contact.service';


@Component({
  selector: 'app-contacts-overview',
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss']
})
export class ContactsOverviewComponent implements OnInit  {
  isVisible: boolean = false;
  groupedContacts: { [key: string]: { name: string; initials: string; email: string; color?: string;  }[] } = {};

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
      const color = contact.color;
  
      if (!this.groupedContacts[firstLetter]) {
        this.groupedContacts[firstLetter] = [];
      }
      
      // Add the contact to the relevant group
      this.groupedContacts[firstLetter].push({ ...contact, initials, color });
    });
  
    // Now, sort each group of contacts alphabetically by name
    for (const letter in this.groupedContacts) {
      this.groupedContacts[letter].sort((a, b) => a.name.localeCompare(b.name));
    }
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

  onContactAdded(contactAdded: boolean): void {
    if (contactAdded) {
      this.loadContacts(); // Refresh the contacts list
    }
}
}

