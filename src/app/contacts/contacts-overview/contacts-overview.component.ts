import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { ScreenSizeService } from 'src/app/services/screen-size.service';


@Component({
  selector: 'app-contacts-overview',
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss']
})
export class ContactsOverviewComponent implements OnInit  {
  isOverlayVisibleContactsView= false
  isVisible: boolean = false;
  groupedContacts: { [key: string]: Contact[] } = {};
  isHandsetOrTablet: boolean = false;
  contactsViewNotVisible: boolean = true
  selectedContact: Contact | null = null;
  storedContactId: number | null = null;

  showContactsAdd(): void {
    this.isVisible = true; // Show the <app-contacts-add> component
  }

  constructor(private addContactService: AddContactService, private router: Router, private screenSizeService: ScreenSizeService) { }

  ngOnInit(): void {
    this.loadContacts();
    this.screenSizeService.isHandsetOrTablet$.subscribe(isHandsetOrTablet => this.isHandsetOrTablet = isHandsetOrTablet);
    if (this.storedContactId) {
      this.loadStoredContactDetails();
    }
  }

  loadStoredContactDetails(): void {
    if (this.storedContactId !== null) {
      this.goToDesktopContactDetails(this.storedContactId);
    }
  }

  loadContacts(): void {
    this.groupedContacts = {};
  
    this.addContactService.getContacts().subscribe({
      next: (contacts) => {
        this.groupContactsByFirstLetter(contacts);
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        // Handle the error, e.g., by showing a user-friendly message
      }
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




closeContactsView(): void {
  this.isOverlayVisibleContactsView = false;

}


openContact(contactId: number): void {
  if (this.isHandsetOrTablet) {
    this.goToContactDetails(contactId);
    
  } else {
    this.goToDesktopContactDetails(contactId);
  }
}


goToContactDetails(contactId: number) {
  if (typeof contactId === 'undefined' || isNaN(contactId)) {
    console.error('Contact ID is undefined or NaN');
    return;
  }
  console.log('Navigating to contact details with ID:', contactId);
  this.router.navigate(['/contacts-detail', contactId]);
}



goToDesktopContactDetails(contactId: number) {
  this.storedContactId = contactId;
  if (typeof contactId === 'undefined' || isNaN(contactId)) {
    console.error('Contact ID is undefined or NaN');
    return;
  }
  console.log('Finding contact with ID:', contactId);
  const contact = this.findContactById(contactId);
  if (!contact) {
    console.error('Contact not found');
    return;
  }
  console.log('Contact found:', contact);
  this.selectedContact = contact;
  this.isOverlayVisibleContactsView = true;
  this.contactsViewNotVisible = false;
}

findContactById(contactId: number): Contact | undefined {
  for (const letter in this.groupedContacts) {
    const contact = this.groupedContacts[letter].find(contact => contact.id === contactId);
    if (contact) {
      return contact;
    }
  }
  return undefined;
}
}

