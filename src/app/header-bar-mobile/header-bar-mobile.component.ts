import { Component } from '@angular/core';

@Component({
  selector: 'app-header-bar-mobile',
  templateUrl: './header-bar-mobile.component.html',
  styleUrls: ['./header-bar-mobile.component.scss']
})
export class HeaderBarMobileComponent {

  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}