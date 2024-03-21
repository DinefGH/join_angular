import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  private registrationUrl = 'http://127.0.0.1:8000/signup/'; // Adjust this URL to your actual endpoint

  constructor(private http: HttpClient) {}

  registerUser(userData: { name: string; email: string; password: string; confirmPassword: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.registrationUrl, userData, { headers: headers });
  }
}