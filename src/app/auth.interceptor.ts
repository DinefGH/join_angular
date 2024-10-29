import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // List of URLs to exclude from adding the Authorization header
    const excludedUrls = ['/signup/', '/login/'];

    // Check if the request URL matches any of the excluded URLs
    if (excludedUrls.some(url => req.url.includes(url))) {
      // Proceed without adding the Authorization header
      return next.handle(req);
    }

    // Attempt to retrieve the token from sessionStorage first, then localStorage
    const authToken = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');

    // If the token exists, clone the request to include the authorization header.
    if (authToken) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Token ${authToken}` },
      });
      return next.handle(authReq);
    }
    // For requests without a token, proceed without modifying the request.
    return next.handle(req);
  }
}
