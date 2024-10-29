import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { ContactsOverlayService } from 'src/app/services/contacts-overlay-service.service';


/**
 * Component for displaying an overview of contacts. Groups contacts alphabetically,
 * handles display based on screen size, and manages visibility of the contacts overlay.
 */
@Component({
  selector: 'app-contacts-overview',
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss'],
})
export class ContactsOverviewComponent implements OnInit {

/** Controls visibility of the add contact overlay. */
  isVisible: boolean = false;

  /** Object to store contacts grouped alphabetically by first letter. */
  groupedContacts: { [key: string]: Contact[] } = {};

  /** Boolean to indicate if the device is a handset or tablet. */
  isHandsetOrTablet: boolean = false;

  /** Boolean to control the visibility of the contacts view overlay. */
  contactsViewNotVisible: boolean = true;

  /** Currently selected contact to display in detail view. */
  selectedContact: Contact | null = null;

  /** Stores contact ID for desktop contact detail display. */
  storedContactId: number | null = null;



    /**
   * Constructor to inject necessary services for managing contacts, routing, screen size, and overlay visibility.
   * @param addContactService - Service for handling contact data.
   * @param router - Angular Router for navigation.
   * @param screenSizeService - Service for detecting screen size.
   * @param contactsOverlayService - Service for managing overlay visibility.
   */
  constructor(
    private addContactService: AddContactService,
    private router: Router,
    private screenSizeService: ScreenSizeService,
    public contactsOverlayService: ContactsOverlayService, 
  ) {}

  showContactsAdd(): void {
    this.isVisible = true; 
  }


    /**
   * Initializes the component by loading contacts and setting up subscriptions to screen size and overlay visibility.
   */
  ngOnInit(): void {
    this.loadContacts();
    this.screenSizeService.isHandsetOrTablet$.subscribe(
      isHandsetOrTablet => (this.isHandsetOrTablet = isHandsetOrTablet),
    );

    
    this.contactsOverlayService.overlayVisibility$.subscribe(isVisible => {
      this.contactsViewNotVisible = !isVisible;
    });

    if (this.storedContactId) {
      this.loadStoredContactDetails();
    }
  }


  /**
 * Loads contact details for a stored contact ID, if available.
 * Navigates to the desktop contact details view for the contact.
 */
  loadStoredContactDetails(): void {
    if (this.storedContactId !== null) {
      this.goToDesktopContactDetails(this.storedContactId);
    }
  }


  /**
 * Loads all contacts from the service and groups them alphabetically by the first letter.
 * Initializes `groupedContacts` as an empty object before adding contacts.
 */
  loadContacts(): void {
    this.groupedContacts = {};

    this.addContactService.getContacts().subscribe({
      next: contacts => {
        this.groupContactsByFirstLetter(contacts);
      },
      error: error => {
        console.error('Error loading contacts:', error);
      },
    });
  }


  /**
 * Groups an array of contacts by the first letter of each contact's name.
 * Adds initials and color properties to each contact.
 * Sorts contacts within each letter group alphabetically by name.
 * @param contacts - Array of contacts to group.
 */
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


  /**
 * Generates initials from a contact's name.
 * Takes the first letter of the first and last name, if available.
 * @param name - The full name of the contact.
 * @returns A string containing the initials.
 */
  getInitials(name: string): string {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }


  /**
 * Returns an array of sorted letters used to group contacts.
 * @returns An alphabetically sorted array of first letters.
 */
  getSortedLetters(): string[] {
    return Object.keys(this.groupedContacts).sort();
  }


  /**
 * Reloads the contacts list when a new contact is successfully added.
 * @param contactAdded - Boolean indicating if a contact was added.
 */
  onContactAdded(contactAdded: boolean): void {
    if (contactAdded) {
      this.loadContacts(); 
    }
  }


  /**
 * Closes the contacts view overlay.
 */
  closeContactsView(): void {
    console.log('Closing contacts view...');
    this.contactsOverlayService.setOverlayVisibility(false); 
  }


  /**
 * Opens the contact details view based on screen size.
 * For handset or tablet, navigates to the contact detail route.
 * For larger screens, shows the contact details in an overlay.
 * @param contactId - ID of the contact to display.
 */
  openContact(contactId: number): void {
    if (this.isHandsetOrTablet) {
      this.goToContactDetails(contactId);
    } else {
      this.goToDesktopContactDetails(contactId);
    }
  }


  /**
 * Navigates to the contact detail page for mobile or tablet view.
 * @param contactId - ID of the contact to navigate to.
 */
  goToContactDetails(contactId: number) {
    if (typeof contactId === 'undefined' || isNaN(contactId)) {
      console.error('Contact ID is undefined or NaN');
      return;
    }
    this.router.navigate(['/contacts-detail', contactId]);
  }


  /**
 * Opens the desktop contact details overlay and sets the selected contact.
 * Stores the contact ID and displays the overlay with contact details.
 * @param contactId - ID of the contact to display in overlay.
 */
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
    this.contactsOverlayService.setOverlayVisibility(true);
  }


  /**
 * Finds a contact by ID within the grouped contacts.
 * @param contactId - ID of the contact to find.
 * @returns The contact object if found, otherwise undefined.
 */
  findContactById(contactId: number): Contact | undefined {
    for (const letter in this.groupedContacts) {
      const contact = this.groupedContacts[letter].find(contact => contact.id === contactId);
      if (contact) {
        return contact;
      }
    }
    return undefined;
  }


  /**
 * Refreshes the contacts list by reloading contacts from the service.
 */
  refreshContacts(): void {
    this.loadContacts();
  }
}
