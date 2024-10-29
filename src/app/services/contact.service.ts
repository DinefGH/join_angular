import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from 'src/assets/models/contact.model'; // Adjust path as necessary

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactSubject = new BehaviorSubject<Contact | null>(null);

  setContactToEdit(contact: Contact): void {
    this.contactSubject.next(contact);
  }

  getContactToEdit(): Observable<Contact | null> {
    return this.contactSubject.asObservable();
  }
}
