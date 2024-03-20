import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router from '@angular/router'

@Component({
  selector: 'app-header-bar-mobile',
  templateUrl: './header-bar-mobile.component.html',
  styleUrls: ['./header-bar-mobile.component.scss']
})
export class HeaderBarMobileComponent {

  isDropdownOpen: boolean = false;

  constructor(private router: Router) {} // Inject the Router

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem('token');
    // If using sessionStorage, uncomment the following line and comment out the localStorage line
    // sessionStorage.removeItem('token');

    // Redirect to the login page or home page after logout
    this.router.navigateByUrl('/login');
  }
}