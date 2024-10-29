import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * AuthInterceptor adds an Authorization header with a token to each HTTP request,
 * except for requests to excluded URLs (e.g., signup and login endpoints).
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}


    /**
   * Intercepts HTTP requests to include an Authorization token, if available.
   * Excludes specific URLs such as signup and login.
   * @param req - The original HTTP request.
   * @param next - The next handler in the HTTP chain.
   * @returns An Observable of the HTTP event, with the Authorization header added if needed.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = ['/signup/', '/login/'];



    /**
 * Checks if the request URL is in the list of excluded URLs, bypassing authentication for those routes.
 * @param req - The original HTTP request.
 * @param next - The next handler in the HTTP request chain.
 * @returns Observable of the HTTP event, with or without the Authorization header.
 */
    if (excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }


    /**
 * Retrieves the authentication token from sessionStorage or localStorage, if available.
 */
    const authToken = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');


    /**
 * If an auth token is present, clones the request with an Authorization header and passes it to the next handler.
 * If no token is found, passes the original request without modification.
 */
    if (authToken) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Token ${authToken}` },
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
