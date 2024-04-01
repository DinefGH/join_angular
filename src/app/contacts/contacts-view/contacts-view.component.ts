import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddContactService } from 'src/app/services/add-contact.service';
import { Contact } from 'src/assets/models/contact.model';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.scss']
})
export class ContactsViewComponent  implements OnInit {
  isVisible: boolean = false;
  contact: Contact | null = null;
  user: any; // Same here for the user, if applicable
  
  public showEditOverlay: boolean = false;

  showContactsEdit(): void {
    this.showEditOverlay = true; // Show the <app-contacts-add> component
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private addContactService: AddContactService // Inject your service here
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const contactId = +params['id'];
      if (contactId) {
        this.fetchContactDetails(contactId);
      } else {
        console.log('No contact ID provided, redirecting...');
        this.router.navigate(['/contacts']);
      }
    });
  }

  private fetchContactDetails(contactId: number): void {
    this.addContactService.getContactById(contactId).subscribe({
      next: (response: any) => { // Ideally, define a more specific type for the response
        console.log('Contact data loaded:', response.contact);
        this.contact = response;
      },
      error: (error) => {
        console.error('Failed to load contact details', error);
        this.router.navigate(['/contacts']);
      }
    });
  }


  getInitials(name: string | undefined): string {
    if (!name) return ''; // This will catch both undefined and empty string cases
  
    let initials = name.split(' ')
                      .filter((n) => n !== '')
                      .map((n) => n[0]?.toUpperCase() ?? '') // Use ?. in case a split result is an empty string
                      .slice(0, 2); // Only take the first two parts for initials
    
    return initials.join('');
  }

  deleteContact(): void {
    if (!this.contact || !this.contact.id) {
      console.error('Attempted to delete a contact without an ID.');
      return;
    }
  
    const contactId = this.contact.id;
    this.addContactService.deleteContact(contactId).subscribe({
      next: () => {
        console.log(`Contact with ID ${contactId} deleted successfully.`);
        this.router.navigate(['/contacts']); // Assuming '/contacts' is your route for the contacts list
      },
      error: (error) => {
        console.error('Failed to delete contact', error);
        // Optionally, implement error handling, e.g., displaying an error message to the user
      }
    });
  }

  onContactEdited(contactEdited: boolean): void {
    if (contactEdited) {
      this.fetchContactDetails(this.contact!.id); // Re-fetch the contact details
      this.showEditOverlay = false;
    }
}
}