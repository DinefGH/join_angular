import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit {

  isSummaryPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      // Utilize a type assertion to inform TypeScript about the expected event structure
      const customEvent = event as any; // Use 'any' to bypass strict type checking

      // Check if the customEvent is a Scroll event with a nested NavigationEnd event
      if (customEvent.routerEvent && customEvent.routerEvent instanceof NavigationEnd) {
        this.setIsSummaryPage(customEvent.routerEvent);
      }
      // Directly handle NavigationEnd events
      else if (event instanceof NavigationEnd) {
        this.setIsSummaryPage(event);
      }
    });

    // Perform an initial check based on the current URL
    this.isSummaryPage = this.router.url.includes('/summary');
  }

  private setIsSummaryPage(event: NavigationEnd) {
    console.log('NavigationEnd event:', event);
    this.isSummaryPage = event.urlAfterRedirects.includes('/summary');
    console.log('Is Summary Page:', this.isSummaryPage);
  }
}