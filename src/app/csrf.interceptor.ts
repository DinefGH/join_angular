// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class CsrfInterceptor implements HttpInterceptor {

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('Intercepting request:', req.url); // Log the request URL

//     // Retrieve CSRF token from cookie
//     const csrfToken = this.getCookie('csrftoken');
//     console.log('CSRF Token:', csrfToken); // Log the CSRF token

//     // Initialize a variable to hold the cloned request
//     let modifiedReq = req;

//     // Check if the request URL is not for the login endpoint
//     if (!req.url.endsWith('/login/')) {
//       // Log whether the request is being modified with the CSRF token and credentials
//       console.log('Modifying request for CSRF token and withCredentials:', req.url);
      
//       modifiedReq = csrfToken ? req.clone({
//         headers: req.headers.set('X-CSRFToken', csrfToken),
//         withCredentials: true
//       }) : req.clone({ withCredentials: true });
//     } else {
//       // Log that the request is a login request and will not be modified
//       console.log('Login request detected, not modifying:', req.url);
//     }

//     // For login requests or if no modifications were made, pass on the original or modified request
//     return next.handle(modifiedReq);
//   }

//   private getCookie(name: string): string | null {
//     let value = "; " + document.cookie;
//     let parts = value.split("; " + name + "=");
//     if (parts.length == 2) {
//       let cookiePart = parts.pop();
//       if (cookiePart) {
//         let cookieValue = cookiePart.split(";").shift();
//         return cookieValue ? cookieValue : null;
//       }
//     }
//     // Log when the cookie is not found
//     console.log(`Cookie named ${name} not found.`);
//     return null; // Return null explicitly if the cookie is not found
//   }
// }