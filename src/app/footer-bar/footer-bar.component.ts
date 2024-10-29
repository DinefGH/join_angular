import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss'],
})
export class FooterBarComponent implements OnInit {
  isSummaryPage: boolean = false;
  isBoardPage: boolean = false;
  isAddTaskPage: boolean = false;
  isContactsPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Reset all page flags to false
        this.resetPageFlags();
        // Set the flag for the current page to true
        this.setPageFlag(event.urlAfterRedirects);
      }
    });
    // Set the initial page flag based on the current URL
    this.setPageFlag(this.router.url);
  }

  private resetPageFlags() {
    this.isSummaryPage = false;
    this.isBoardPage = false;
    this.isAddTaskPage = false;
    this.isContactsPage = false;
  }

  private setPageFlag(url: string) {
    this.isSummaryPage = url.includes('/summary');
    this.isBoardPage = url.includes('/board');
    this.isAddTaskPage = url.includes('/addtask');
    this.isContactsPage = url.includes('/contacts');
  }

  goToContacts() {
    this.router.navigate(['/contacts']);
  }

  goToSummary() {
    this.router.navigate(['/summary']);
  }

  goToAddtask() {
    this.router.navigate(['/addtask']);
  }

  goToBoard() {
    this.router.navigate(['/board']);
  }
}
