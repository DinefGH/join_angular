import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AddContactService {
  private baseUrl = 'http://127.0.0.1:8000'; // Adjust with your Django backend URL

  constructor(private http: HttpClient) { }

  addContact(contactData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.baseUrl}/addcontact/`, contactData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error occurred while adding contact:', error);
          return throwError(error);
        })
      );
  }


  getContacts(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.baseUrl}/addcontact/`, { headers }) // Adjust URL path as needed
      .pipe(
        catchError(error => {
          console.error('Error occurred while fetching contacts:', error);
          return throwError(error);
        })
      );
  }


  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'); // Retrieve token from storage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // Adjust if you use a different token prefix
    });
  }

  getContactById(contactId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.baseUrl}/contact/${contactId}/`, { headers })
      .pipe(
        tap(data => console.log(`Data loaded for contact ID ${contactId}:`, data)),
        catchError(error => {
          console.error(`Error occurred while fetching contact with ID ${contactId}:`, error);
          return throwError(error);
        })
      );
  }

  deleteContact(contactId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.baseUrl}/contact/${contactId}/`, { headers })
      .pipe(
        catchError(error => {
          console.error(`Error occurred while deleting contact with ID ${contactId}:`, error);
          return throwError(error);
        })
      );
  }

  updateContact(contactId: number, contactData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${this.baseUrl}/contact/${contactId}/`, contactData, { headers })
      .pipe(
        tap(data => console.log(`Data updated for contact ID ${contactId}:`, data)),
        catchError(error => {
          console.error(`Error occurred while updating contact with ID ${contactId}:`, error);
          return throwError(error);
        })
      );
  }
}