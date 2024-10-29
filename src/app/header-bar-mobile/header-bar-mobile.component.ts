import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router from '@angular/router'
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/assets/models/user.model';


/**
 * HeaderBarMobileComponent is responsible for managing the mobile header bar,
 * displaying user initials, and handling navigation and logout.
 */
@Component({
  selector: 'app-header-bar-mobile',
  templateUrl: './header-bar-mobile.component.html',
  styleUrls: ['./header-bar-mobile.component.scss'],
})
export class HeaderBarMobileComponent implements OnInit {

    /** Controls the visibility of the dropdown menu. */
  isDropdownOpen: boolean = false;

  /** Stores the initial of the user's name for display. */
  userInitial: string = '';


    /**
   * Constructor to inject the Angular Router for navigation and UserService for user data.
   * @param router - Router for navigation.
   * @param userService - Service for fetching user information.
   */
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}


  /**
   * Initializes the component by fetching the current user and setting the user's initial.
   * Assumes `name` property in User model represents the full name.
   */
  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user && user.name) {
        // Assuming 'name' is a property of the User model and contains the full name
        this.userInitial = user.name.charAt(0).toUpperCase();
      }
    });
  }


  /** Toggles the visibility of the dropdown menu. */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


    /**
   * Logs the user out by clearing relevant local and session storage data
   * and navigating to the login page.
   */
  logout() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user_details');
    this.router.navigateByUrl('/login');
    sessionStorage.removeItem('showOverlay');
  }


  /** Navigates to the Summary page. */
  goToSummary() {
    this.router.navigate(['/summary']);
  }
}
