import { Component } from '@angular/core';

@Component({
  selector: 'app-contacts-overview',
  templateUrl: './contacts-overview.component.html',
  styleUrls: ['./contacts-overview.component.scss']
})
export class ContactsOverviewComponent {
  isVisible: boolean = false;

  showContactsAdd(): void {
    this.isVisible = true; // Show the <app-contacts-add> component
  }
}

