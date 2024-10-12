import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/assets/models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDetailsUrl = 'join.server.fabianduerr.com/user/details'; // Adjust as necessary
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // Attempt to retrieve the user's details from localStorage or sessionStorage upon service initialization
    const storedUser = localStorage.getItem('user_details') ? JSON.parse(localStorage.getItem('user_details') || '{}') : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
  }

  fetchCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return of(null); // Ensure to return an Observable<User | null>
    }
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
    return this.http.get<User>(this.userDetailsUrl, { headers: headers }).pipe(
      tap(user => {
        this.setCurrentUser(user); // Update and persist user details upon fetching
      }),
      catchError(error => {
        console.error('Error fetching user details:', error);
        return of(null); // Ensure to return an Observable<User | null>
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if(user) {
      // Persist the user's details to localStorage or sessionStorage as needed
      localStorage.setItem('user_details', JSON.stringify(user));
    }
  }
}