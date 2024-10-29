import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';


/**
 * AddContactService is responsible for managing contact data by providing
 * methods to add, fetch, update, and delete contacts. It includes authentication
 * in the header of each request.
 */
@Injectable({
  providedIn: 'root',
})
export class AddContactService {

  /** Base URL for the API endpoints. */
  private baseUrl = 'https://join.server.fabianduerr.com';


    /**
   * Constructor to inject HttpClient for making HTTP requests.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(private http: HttpClient) {}


    /**
   * Adds a new contact with the provided contact data.
   * @param contactData - Object containing the contact's information.
   * @returns An Observable that emits the response from the API.
   */
  addContact(contactData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.baseUrl}/addcontact/`, contactData, { headers }).pipe(
      catchError(error => {
        console.error('Error occurred while adding contact:', error);
        return throwError(error);
      }),
    );
  }


    /**
   * Retrieves the list of contacts from the API.
   * @returns An Observable that emits the list of contacts.
   */
  getContacts(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.baseUrl}/addcontact/`, { headers }).pipe(
      catchError(error => {
        console.error('Error occurred while fetching contacts:', error);
        return throwError(error);
      }),
    );
  }


  /**
   * Creates an HTTP Authorization header with the stored authentication token.
   * @returns An HttpHeaders object containing the Authorization header.
   */
  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    });
  }


    /**
   * Fetches a contact by its ID.
   * @param contactId - The ID of the contact to fetch.
   * @returns An Observable that emits the contact's data.
   */
  getContactById(contactId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.baseUrl}/contact/${contactId}/`, { headers }).pipe(
      catchError(error => {
        console.error(`Error occurred while fetching contact with ID ${contactId}:`, error);
        return throwError(error);
      }),
    );
  }


    /**
   * Deletes a contact by its ID.
   * @param contactId - The ID of the contact to delete.
   * @returns An Observable that emits the response from the API.
   */
  deleteContact(contactId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.baseUrl}/contact/${contactId}/`, { headers }).pipe(
      catchError(error => {
        console.error(`Error occurred while deleting contact with ID ${contactId}:`, error);
        return throwError(error);
      }),
    );
  }


    /**
   * Updates an existing contact with new data.
   * @param contactId - The ID of the contact to update.
   * @param contactData - Object containing the updated contact information.
   * @returns An Observable that emits the response from the API.
   */
  updateContact(contactId: number, contactData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${this.baseUrl}/contact/${contactId}/`, contactData, { headers }).pipe(
      catchError(error => {
        console.error(`Error occurred while updating contact with ID ${contactId}:`, error);
        return throwError(error);
      }),
    );
  }
}
