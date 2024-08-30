import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsOverlayService {
  private overlayVisibilitySubject = new BehaviorSubject<boolean>(false);
  overlayVisibility$ = this.overlayVisibilitySubject.asObservable();

  setOverlayVisibility(isVisible: boolean): void {
    this.overlayVisibilitySubject.next(isVisible);
  }

  getOverlayVisibility(): boolean {
    return this.overlayVisibilitySubject.value;
  }
}