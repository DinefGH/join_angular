import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'http://127.0.0.1:8000/login/'; 
  private protectedUrl = 'http://127.0.0.1:8000/protected/'; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{token: string}>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        // Store the received token in localStorage
        localStorage.setItem('auth_token', response.token);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null); // or throw an error
      })
    );
  }

  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('auth_token');
    // Redirect to login page or home page as needed
    // this.router.navigate(['/login']);
  }

  getProtectedData(): Observable<any> {
    // Include the token in the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('auth_token')}`
    });
    return this.http.get(this.protectedUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching protected data:', error);
        return of(null); // Handle the error appropriately
      })
    );
  }

  // Helper function to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
