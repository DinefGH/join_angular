import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


/**
 * UserRegistrationService handles user registration requests to the server.
 * It sends user data to the API and manages error handling during the registration process.
 */
@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {

    /** URL endpoint for user registration. */
  private registrationUrl = 'https://join.server.fabianduerr.com/signup/';


    /**
   * Constructor to inject HttpClient for making HTTP requests.
   * @param http - The HttpClient instance for sending registration data.
   */
  constructor(private http: HttpClient) {}


    /**
   * Registers a new user by sending user data to the registration API.
   * @param userData - Object containing user details: name, email, password, and confirmPassword.
   * @returns An Observable that emits the server's response or an error if the registration fails.
   */
  registerUser(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(this.registrationUrl, userData, { headers: headers })
      .pipe(catchError(this.handleError));
  }


    /**
   * Handles errors that occur during the registration process.
   * Logs the error to the console and rethrows it for further handling.
   * @param error - The error response object.
   * @returns An Observable that emits an error notification.
   */
  private handleError(error: any) {
    console.error('There was an error in Service!', error);
    return throwError(error);
  }
}
