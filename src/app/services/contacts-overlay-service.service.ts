import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


/**
 * ContactsOverlayService manages the visibility state of the contacts overlay.
 * It provides methods to set and retrieve the overlay visibility status.
 */@Injectable({
  providedIn: 'root',
})
export class ContactsOverlayService {

  /** BehaviorSubject that holds the current visibility state of the overlay. */
  private overlayVisibilitySubject = new BehaviorSubject<boolean>(false);

  /** Observable for overlay visibility changes, allowing components to subscribe to visibility updates. */
  overlayVisibility$ = this.overlayVisibilitySubject.asObservable();


    /**
   * Sets the visibility state of the contacts overlay.
   * @param isVisible - Boolean indicating whether the overlay should be visible.
   */
  setOverlayVisibility(isVisible: boolean): void {
    this.overlayVisibilitySubject.next(isVisible);
  }


  /**
   * Retrieves the current visibility state of the contacts overlay.
   * @returns A boolean representing the current visibility of the overlay.
   */
  getOverlayVisibility(): boolean {
    return this.overlayVisibilitySubject.value;
  }
}
