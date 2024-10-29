import { Component } from '@angular/core';

/**
 * Root component of the application, serving as the main entry point.
 * It sets up the initial structure and layout for the app.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  /** Title of the application, displayed in the browser tab or window. */
  title = 'join2.0_angular';
}