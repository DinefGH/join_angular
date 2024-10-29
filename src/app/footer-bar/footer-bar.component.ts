import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';


/**
 * FooterBarComponent is responsible for navigation within the footer bar,
 * highlighting the active page and providing shortcuts to key sections.
 */
@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss'],
})
export class FooterBarComponent implements OnInit {

  /** Boolean indicating if the Summary page is active. */
  isSummaryPage: boolean = false;

  /** Boolean indicating if the Board page is active. */
  isBoardPage: boolean = false;

  /** Boolean indicating if the Add Task page is active. */
  isAddTaskPage: boolean = false;

  /** Boolean indicating if the Contacts page is active. */
  isContactsPage: boolean = false;


   /**
   * Constructor to inject the Angular Router for navigation and URL monitoring.
   * @param router - Router for navigation and tracking route events.
   */
  constructor(private router: Router) {}


    /**
   * Initializes the component by subscribing to router events to set the current active page.
   * Sets the page flag based on the initial route on component load.
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
   * Resets all page flags to false. Called before setting the active page flag.
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
}
