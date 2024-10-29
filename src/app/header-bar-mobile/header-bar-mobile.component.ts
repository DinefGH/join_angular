import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router from '@angular/router'
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/assets/models/user.model';

@Component({
  selector: 'app-header-bar-mobile',
  templateUrl: './header-bar-mobile.component.html',
  styleUrls: ['./header-bar-mobile.component.scss'],
})
export class HeaderBarMobileComponent implements OnInit {
  isDropdownOpen: boolean = false;
  userInitial: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user && user.name) {
        // Assuming 'name' is a property of the User model and contains the full name
        this.userInitial = user.name.charAt(0).toUpperCase();
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user_details');
    this.router.navigateByUrl('/login');
    sessionStorage.removeItem('showOverlay');
  }

  goToSummary() {
    this.router.navigate(['/summary']);
  }
}
