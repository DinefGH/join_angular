import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddContactService {
  private baseUrl = 'http://127.0.0.1:8000'; // Adjust with your Django backend URL

  constructor(private http: HttpClient) { }

  addContact(contactData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.baseUrl}/addcontact/`, contactData, { headers: headers });
  }

  getContacts(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.baseUrl}/addcontact/`, { headers: headers }); // Adjust URL path as needed
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'); // Retrieve token from storage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // Adjust if you use a different token prefix
    });
  }
}