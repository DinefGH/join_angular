import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';
import { ContactsOverlayService } from 'src/app/services/contacts-overlay-service.service';



@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.scss']
})
export class ContactsViewComponent implements OnInit, OnChanges {
  @Input() contactId: number | null = null;
  @Input() isOverlayVisibleContactsView: boolean = false;
  isVisible: boolean = false;
  @Input() contact: Contact | null = null;
  @Output() contactDeleted = new EventEmitter<void>();
  @Output() contactUpdated = new EventEmitter<void>(); 
  @Output() close = new EventEmitter<void>();

  public showEditOverlay: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addContactService: AddContactService,
    private contactsOverlayService: ContactsOverlayService
  ) {}

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactId'] && changes['contactId'].currentValue) {
      this.fetchContactDetails(changes['contactId'].currentValue);
    }
  }

  private fetchContactDetails(contactId: number): void {
    this.addContactService.getContactById(contactId).subscribe({
      next: (response: Contact) => {
        this.contact = response;
      },
      error: (error) => {
        console.error('Failed to load contact details', error);
        this.router.navigate(['/contacts']);
      }
    });
  }

  showContactsEdit(): void {
    if (this.contact) {
      this.showEditOverlay = true;
    } else {
      console.error('Contact data is not available.');
    }
  }

  getInitials(name: string | undefined): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

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
      error: (error) => {
        console.error('Failed to delete contact', error);
      }
    });
  }

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

  goBackToContacts(): void {
    this.router.navigate(['/contacts']);
  }
}