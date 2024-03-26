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
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'); // Retrieve token from storage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // Adjust if you use a different token prefix
    });
    return this.http.post(`${this.baseUrl}/addcontact/`, contactData, { headers: headers });
  }
}