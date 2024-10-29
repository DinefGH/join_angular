import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';


/**
 * AuthInterceptorService intercepts HTTP requests to add an authorization token
 * and redirects to the login page if the user is unauthorized (401 error).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {


    /**
   * Constructor to inject the Router for navigation upon authentication failure.
   * @param router - Angular Router to navigate on unauthorized access.
   */
  constructor(private router: Router) {}


    /**
   * Intercepts HTTP requests to add an Authorization header with a token, if available.
   * Handles errors, specifically redirecting to login on 401 Unauthorized errors.
   * @param request - The outgoing HTTP request to be intercepted.
   * @param next - The next interceptor in the chain or the final backend handler.
   * @returns An Observable of the HTTP event with authorization headers applied, if a token is available.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Token ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigateByUrl('/login');
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
