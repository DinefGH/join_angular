import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Retrieve CSRF token from cookie
    const csrfToken = this.getCookie('csrftoken');
    if (csrfToken) {
      // Clone the request to add the new header.
      const csrfReq = req.clone({ headers: req.headers.set('X-CSRFToken', csrfToken) });
      // Pass on the cloned request instead of the original request.
      return next.handle(csrfReq);
    }
    return next.handle(req);
  }

  private getCookie(name: string): string | null {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      let cookiePart = parts.pop();
      if (cookiePart) {
        let cookieValue = cookiePart.split(";").shift();
        return cookieValue ? cookieValue : null;
      }
    }
    return null; // Return null explicitly if the cookie is not found
  }
}