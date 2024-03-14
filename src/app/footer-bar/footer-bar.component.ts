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
      const customEvent = event as any; 
      if (customEvent.routerEvent && customEvent.routerEvent instanceof NavigationEnd) {
        this.setIsSummaryPage(customEvent.routerEvent);
      }
      else if (event instanceof NavigationEnd) {
        this.setIsSummaryPage(event);
      }
    });
    this.isSummaryPage = this.router.url.includes('/summary');
  }
  private setIsSummaryPage(event: NavigationEnd) {
    console.log('NavigationEnd event:', event);
    this.isSummaryPage = event.urlAfterRedirects.includes('/summary');
    console.log('Is Summary Page:', this.isSummaryPage);
  }
}