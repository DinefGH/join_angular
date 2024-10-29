import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/assets/models/user.model';


/**
 * UserService manages user data, including fetching and setting the current user.
 * It uses local storage to persist user information and a BehaviorSubject to provide the current user as an observable.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {

  /** URL to retrieve user details from the server. */
  private userDetailsUrl = 'https://join.server.fabianduerr.com/user/details';

  /** BehaviorSubject to hold the current user details. */
  private currentUserSubject = new BehaviorSubject<any>(null);


  /**
   * Initializes the service by checking local storage for existing user details.
   * If found, sets them as the current user.
   * @param http - HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user_details')
      ? JSON.parse(localStorage.getItem('user_details') || '{}')
      : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
  }


  /**
   * Fetches the current user details from the server using the stored authentication token.
   * Updates the current user in the service if successful.
   * @returns An Observable emitting the User object or null if the request fails.
   */
  fetchCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return of(null); 
    }
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
    return this.http.get<User>(this.userDetailsUrl, { headers: headers }).pipe(
      tap(user => {
        this.setCurrentUser(user); 
      }),
      catchError(error => {
        console.error('Error fetching user details:', error);
        return of(null); 
      }),
    );
  }


  /**
   * Retrieves the current user as an observable.
   * @returns An Observable emitting the current User object or null if no user is set.
   */
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }


  /**
   * Sets the current user both in the BehaviorSubject and in local storage.
   * If the user is null, it clears the user details from local storage.
   * @param user - The User object to set as the current user or null to clear.
   */
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('user_details', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_details');
    }
  }
}
