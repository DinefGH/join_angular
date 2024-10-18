import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  private registrationUrl = 'https://join.server.fabianduerr.com/signup/';

  constructor(private http: HttpClient) {}

  registerUser(userData: { name: string; email: string; password: string; confirmPassword: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.registrationUrl, userData, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    // Log error to console or display to the user
    console.error('There was an error in Service!', error);
    return throwError(error);
  }
}