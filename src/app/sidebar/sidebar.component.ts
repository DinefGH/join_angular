import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';


/**
 * SidebarComponent manages the sidebar navigation and highlights the active page.
 * It includes navigation methods to various sections and external links.
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  /** Indicates if the Summary page is currently active. */
  isSummaryPage: boolean = false;

  /** Indicates if the Board page is currently active. */
  isBoardPage: boolean = false;

  /** Indicates if the Add Task page is currently active. */
  isAddTaskPage: boolean = false;

  /** Indicates if the Contacts page is currently active. */
  isContactsPage: boolean = false;


    /**
   * Constructor that injects the Angular Router for navigation.
   * @param router - Router for navigation and monitoring route changes.
   */
  constructor(private router: Router) {}


    /**
   * Initializes the component by subscribing to router events
   * to set the active page and update page flags.
   */
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.resetPageFlags();
        this.setPageFlag(event.urlAfterRedirects);
      }
    });
    this.setPageFlag(this.router.url);
  }


    /**
   * Resets all page flags to false, called before setting the active page flag.
   */
  private resetPageFlags() {
    this.isSummaryPage = false;
    this.isBoardPage = false;
    this.isAddTaskPage = false;
    this.isContactsPage = false;
  }


    /**
   * Sets the appropriate page flag to true based on the current URL.
   * @param url - The current URL to determine the active page.
   */
  private setPageFlag(url: string) {
    this.isSummaryPage = url.includes('/summary');
    this.isBoardPage = url.includes('/board');
    this.isAddTaskPage = url.includes('/addtask');
    this.isContactsPage = url.includes('/contacts');
  }


    /** Navigates to the Contacts page. */
  goToContacts() {
    this.router.navigate(['/contacts']);
  }


    /** Navigates to the Summary page. */
  goToSummary() {
    this.router.navigate(['/summary']);
  }


    /** Navigates to the Add Task page. */
  goToAddtask() {
    this.router.navigate(['/addtask']);
  }


    /** Navigates to the Board page. */
  goToBoard() {
    this.router.navigate(['/board']);
  }


    /** Opens the Privacy Policy page in a new tab. */
  goToPolicy() {
    window.open('/privacy-policy', '_blank');
  }


    /** Opens the Legal Notice page in a new tab. */
  goToLegal() {
    window.open('/legal-notice', '_blank');
  }
}
