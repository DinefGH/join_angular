import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { ContactsOverlayService } from 'src/app/services/contacts-overlay-service.service';

@Component({
  selector: 'app-contacts-overview',
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss']
})
export class ContactsOverviewComponent implements OnInit  {
  isVisible: boolean = false;
  groupedContacts: { [key: string]: Contact[] } = {};
  isHandsetOrTablet: boolean = false;
  contactsViewNotVisible: boolean = true;
  selectedContact: Contact | null = null; 
  storedContactId: number | null = null;

  constructor(
    private addContactService: AddContactService, 
    private router: Router, 
    private screenSizeService: ScreenSizeService, 
    public contactsOverlayService: ContactsOverlayService   // Inject the service
  ) { }

  showContactsAdd(): void {
    this.isVisible = true; // Show the <app-contacts-add> component
  }

  ngOnInit(): void {
    this.loadContacts();
    this.screenSizeService.isHandsetOrTablet$.subscribe(isHandsetOrTablet => this.isHandsetOrTablet = isHandsetOrTablet);

    // Subscribe to the overlay visibility changes
    this.contactsOverlayService.overlayVisibility$.subscribe(isVisible => {
      this.contactsViewNotVisible = !isVisible;
    });

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
      }
    });
  }

  groupContactsByFirstLetter(contacts: any[]): void {
    this.groupedContacts = {};

    contacts.forEach(contact => {
      const firstLetter = contact.name[0].toUpperCase();
      const initials = this.getInitials(contact.name);
      const color = contact.color;
  
      if (!this.groupedContacts[firstLetter]) {
        this.groupedContacts[firstLetter] = [];
      }
      
      this.groupedContacts[firstLetter].push({ ...contact, initials, color });
    });
  
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
    console.log('Closing contacts view...');
    this.contactsOverlayService.setOverlayVisibility(false);  // Update via service
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
    this.router.navigate(['/contacts-detail', contactId]);
  }

  goToDesktopContactDetails(contactId: number) {
    this.storedContactId = contactId;
    if (typeof contactId === 'undefined' || isNaN(contactId)) {
      console.error('Contact ID is undefined or NaN');
      return;
    }
    const contact = this.findContactById(contactId);
    if (!contact) {
      console.error('Contact not found');
      return;
    }
    this.selectedContact = contact;
    this.contactsOverlayService.setOverlayVisibility(true);  // Use service to set visibility
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

  refreshContacts(): void {
    this.loadContacts();
  }
}
