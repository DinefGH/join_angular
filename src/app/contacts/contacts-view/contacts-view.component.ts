import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { ContactsOverlayService } from 'src/app/services/contacts-overlay-service.service';


/**
 * Component to view detailed information of a contact. Allows editing and deleting a contact.
 * Supports displaying contact details in an overlay or standalone view based on screen size and visibility settings.
 */
@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.scss'],
})
export class ContactsViewComponent implements OnInit, OnChanges {

  /** The ID of the contact to view, which triggers fetching of contact details. */
  @Input() contactId: number | null = null;

  /** Boolean to control the visibility of the contact view overlay. */
  @Input() isOverlayVisibleContactsView: boolean = false;

  /** Boolean to manage internal visibility of the overlay within the component. */
  isVisible: boolean = false;

  /** Contact model containing details of the current contact. */
  @Input() contact: Contact | null = null;

  /** Event emitted when a contact is deleted. */
  @Output() contactDeleted = new EventEmitter<void>();

  /** Event emitted when a contact is updated. */
  @Output() contactUpdated = new EventEmitter<void>();

  /** Event emitted when the contact view component is closed. */
  @Output() close = new EventEmitter<void>();

  /** Boolean to control the display of the edit overlay for the contact. */
  public showEditOverlay: boolean = false;


    /**
   * Constructor to inject necessary services for managing contact data, navigation, and overlay visibility.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router - Angular Router for navigation.
   * @param addContactService - Service for managing contact data.
   * @param contactsOverlayService - Service for managing overlay visibility.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addContactService: AddContactService,
    private contactsOverlayService: ContactsOverlayService,
  ) {}


    /**
   * Initializes the component by loading contact details if a contact ID is provided
   * or if present in the route parameters.
   */
  ngOnInit(): void {
    if (this.contactId) {
      this.fetchContactDetails(this.contactId);
    } else if (!this.contact) {
      this.route.params.subscribe(params => {
        const contactId = +params['id'];
        if (contactId) {
          this.fetchContactDetails(contactId);
        } else {
          this.router.navigate(['/contacts']);
        }
      });
    }
  }


    /**
   * Updates the contact details when the contact ID input changes.
   * @param changes - Object containing the changes in component input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactId'] && changes['contactId'].currentValue) {
      this.fetchContactDetails(changes['contactId'].currentValue);
    }
  }


  /**
   * Fetches contact details based on the provided contact ID.
   * If retrieval fails, navigates back to the contacts list.
   * @param contactId - The ID of the contact to retrieve.
   */
  private fetchContactDetails(contactId: number): void {
    this.addContactService.getContactById(contactId).subscribe({
      next: (response: Contact) => {
        this.contact = response;
      },
      error: error => {
        console.error('Failed to load contact details', error);
        this.router.navigate(['/contacts']);
      },
    });
  }


    /**
   * Displays the edit overlay for the current contact, if available.
   */
  showContactsEdit(): void {
    if (this.contact) {
      this.showEditOverlay = true;
    } else {
      console.error('Contact data is not available.');
    }
  }


    /**
   * Generates initials from the contact's name for display purposes.
   * @param name - The name of the contact.
   * @returns A string with the initials derived from the name.
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
   * Deletes the current contact and emits a contactDeleted event.
   * If deletion is successful, navigates back to the contacts list.
   */

  deleteContact(): void {
    if (!this.contact || !this.contact.id) {
      console.error('Attempted to delete a contact without an ID.');
      return;
    }

    const contactId = this.contact.id;
    this.addContactService.deleteContact(contactId).subscribe({
      next: () => {
        this.router.navigate(['/contacts']);
        this.contactDeleted.emit();
        this.contactsOverlayService.setOverlayVisibility(false);
      },
      error: error => {
        console.error('Failed to delete contact', error);
      },
    });
  }


    /**
   * Handles the contact edit event. If successful, reloads contact details and emits contactUpdated event.
   * @param contactEdited - Boolean indicating whether the contact was successfully edited.
   */
  onContactEdited(contactEdited: boolean): void {
    if (contactEdited) {
      if (this.contact && this.contact.id) {
        this.fetchContactDetails(this.contact.id);
        this.contactUpdated.emit();
        this.showEditOverlay = false;
      } else {
        console.error('No contact or contact ID available for editing.');
      }
    } else {
      console.log('Contact edit was not successful.');
    }
  }


    /**
   * Navigates back to the contacts list view.
   */
  goBackToContacts(): void {
    this.router.navigate(['/contacts']);
  }
}
