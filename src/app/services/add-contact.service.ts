import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AddContactService {
  private baseUrl = 'https://join.server.fabianduerr.com'; 

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
    return this.http.get(`${this.baseUrl}/addcontact/`, { headers }) 
      .pipe(
        catchError(error => {
          console.error('Error occurred while fetching contacts:', error);
          return throwError(error);
        })
      );
  }


  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
  }

  getContactById(contactId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.baseUrl}/contact/${contactId}/`, { headers })
      .pipe(
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
        catchError(error => {
          console.error(`Error occurred while updating contact with ID ${contactId}:`, error);
          return throwError(error);
        })
      );
  }
}