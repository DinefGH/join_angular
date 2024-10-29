import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription } from 'rxjs';
import { Subject } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule],
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

  it('should reset all page flags to false when resetPageFlags is called', () => {
    // Set the flags to true before calling the private method
    component.isSummaryPage = true;
    component.isBoardPage = true;
    component.isAddTaskPage = true;
    component.isContactsPage = true;

    // Call the private method using TypeScript's access to private members
    (component as any).resetPageFlags();

    // Expect all flags to be false after resetPageFlags is called
    expect(component.isSummaryPage).toBeFalse();
    expect(component.isBoardPage).toBeFalse();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeFalse();
  });
});
