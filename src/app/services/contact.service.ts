import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from 'src/assets/models/contact.model'; // Adjust path as necessary


/**
 * ContactService is responsible for managing the state of the contact being edited.
 * It provides methods to set and retrieve the current contact for editing.
 */
@Injectable({
  providedIn: 'root',
})
export class ContactService {

  /** BehaviorSubject that holds the contact currently being edited. */
  private contactSubject = new BehaviorSubject<Contact | null>(null);


    /**
   * Sets the contact to be edited by updating the contactSubject.
   * @param contact - The Contact object to set as the current contact for editing.
   */
  setContactToEdit(contact: Contact): void {
    this.contactSubject.next(contact);
  }


    /**
   * Retrieves an observable of the current contact being edited.
   * @returns An Observable that emits the Contact object or null if no contact is set.
   */
  getContactToEdit(): Observable<Contact | null> {
    return this.contactSubject.asObservable();
  }
}
