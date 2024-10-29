import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';


/**
 * AuthGuard is used to protect routes from unauthorized access.
 * It checks for an authentication token and redirects to the login page if none is found.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {


    /**
   * Constructor that injects the Angular Router for navigation.
   * @param router - Router to redirect unauthenticated users to the login page.
   */
  constructor(private router: Router) {}



    /**
   * Determines if a route can be activated based on the presence of an auth token.
   * Redirects to the login page if the user is not authenticated.
   * @param route - The route that is being accessed.
   * @param state - The current router state.
   * @returns A boolean or UrlTree indicating whether navigation is allowed.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      // Redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
