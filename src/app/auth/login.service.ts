import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Service responsible for handling user login, logout, and access to protected data.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {

    /** URL for the login endpoint */
  private loginUrl = 'https://join.server.fabianduerr.com/login/';

  /** URL for accessing protected resources */
  private protectedUrl = 'https://join.server.fabianduerr.com/protected/';


    /**
   * Constructor that injects HttpClient for making HTTP requests.
   * @param http - Angular's HttpClient for HTTP communication.
   */
  constructor(private http: HttpClient) {}


    /**
   * Logs in a user with the provided email and password.
   * Stores the authentication token in local storage upon successful login.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns Observable<any> - Observable with the server response or null in case of error.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        sessionStorage.setItem('showOverlaySummary', 'true');
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null); 
      }),
    );
  }


    /**
   * Logs out the user by removing the authentication token from local storage.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('showOverlay');
  }


    /**
   * Retrieves protected data from the server, including an authorization token in the request headers.
   * @returns Observable<any> - Observable with the server's protected data or null in case of error.
   */
  getProtectedData(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${localStorage.getItem('auth_token')}`,
    });
    return this.http.get(this.protectedUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching protected data:', error);
        return of(null); 
      }),
    );
  }


    /**
   * Checks if the user is currently logged in by verifying the presence of an auth token.
   * @returns boolean - True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
