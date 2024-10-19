import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should initialize and set the page flags based on the current route', () => {
    // Mock initial route
    Object.defineProperty(router, 'url', { value: '/summary' });
    component.ngOnInit();

    expect(component.isSummaryPage).toBeTrue();
    expect(component.isBoardPage).toBeFalse();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeFalse();
  });

  it('should update page flags when NavigationEnd event occurs', () => {
    // Create a mock NavigationEnd event
    const navigationEnd = new NavigationEnd(1, '/board', '/board');

    // Spy on the router.events observable and return a NavigationEnd event
    spyOn(router.events, 'subscribe').and.callFake((callback: any) => {
      if (typeof callback === 'function') {
        // Invoke the callback with the mock NavigationEnd event
        callback(navigationEnd);
      } else if (callback && typeof callback.next === 'function') {
        // If it's an observer, call the next method with the event
        callback.next(navigationEnd);
      }
      return new Subscription(); // Return a Subscription object to mimic the real subscribe method
    });

    component.ngOnInit();

    expect(component.isBoardPage).toBeTrue();
    expect(component.isSummaryPage).toBeFalse();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeFalse();
  });

  it('should navigate to /contacts when goToContacts is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToContacts();
    expect(navigateSpy).toHaveBeenCalledWith(['/contacts']);
  });

  it('should navigate to /summary when goToSummary is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToSummary();
    expect(navigateSpy).toHaveBeenCalledWith(['/summary']);
  });

  it('should navigate to /addtask when goToAddtask is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToAddtask();
    expect(navigateSpy).toHaveBeenCalledWith(['/addtask']);
  });

  it('should navigate to /board when goToBoard is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToBoard();
    expect(navigateSpy).toHaveBeenCalledWith(['/board']);
  });

  it('should open the privacy policy in a new tab when goToPolicy is called', () => {
    const windowSpy = spyOn(window, 'open');
    component.goToPolicy();
    expect(windowSpy).toHaveBeenCalledWith('/privacy-policy', '_blank');
  });

  it('should open the legal notice in a new tab when goToLegal is called', () => {
    const windowSpy = spyOn(window, 'open');
    component.goToLegal();
    expect(windowSpy).toHaveBeenCalledWith('/legal-notice', '_blank');
  });
});
