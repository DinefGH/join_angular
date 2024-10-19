import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterBarComponent } from './footer-bar.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('FooterBarComponent', () => {
  let component: FooterBarComponent;
  let fixture: ComponentFixture<FooterBarComponent>;
  let router: Router;
  let routerEventsSubject: Subject<NavigationEnd>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<NavigationEnd>();

    await TestBed.configureTestingModule({
      declarations: [FooterBarComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Simulate router events using Subject
    spyOn(router.events, 'subscribe').and.callFake((callback: any) => {
      const subscription = routerEventsSubject.subscribe(callback);
      return new Subscription(() => subscription.unsubscribe());
    });

    fixture.detectChanges(); // Trigger ngOnInit
  });

  afterEach(() => {
    routerEventsSubject.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct page flag based on the URL (summary page)', () => {
    // Simulate navigation to '/summary'
    routerEventsSubject.next(new NavigationEnd(0, '/summary', '/summary'));
    fixture.detectChanges(); // Update the component after the event

    expect(component.isSummaryPage).toBeTrue();
    expect(component.isBoardPage).toBeFalse();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeFalse();
  });



  it('should set the correct page flag based on the URL (board page)', () => {
    // Simulate navigation to '/board'
    routerEventsSubject.next(new NavigationEnd(0, '/board', '/board'));
    fixture.detectChanges();

    expect(component.isSummaryPage).toBeFalse();
    expect(component.isBoardPage).toBeTrue();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeFalse();
  });



  it('should set the correct page flag based on the URL (add task page)', () => {
    // Simulate navigation to '/addtask'
    routerEventsSubject.next(new NavigationEnd(0, '/addtask', '/addtask'));
    fixture.detectChanges();

    expect(component.isSummaryPage).toBeFalse();
    expect(component.isBoardPage).toBeFalse();
    expect(component.isAddTaskPage).toBeTrue();
    expect(component.isContactsPage).toBeFalse();
  });



  it('should set the correct page flag based on the URL (contacts page)', () => {
    // Simulate navigation to '/contacts'
    routerEventsSubject.next(new NavigationEnd(0, '/contacts', '/contacts'));
    fixture.detectChanges();

    expect(component.isSummaryPage).toBeFalse();
    expect(component.isBoardPage).toBeFalse();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeTrue();
  });


  it('should navigate to contacts page when goToContacts is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToContacts();
    expect(navigateSpy).toHaveBeenCalledWith(['/contacts']);
  });


  it('should navigate to summary page when goToSummary is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToSummary();
    expect(navigateSpy).toHaveBeenCalledWith(['/summary']);
  });


  it('should navigate to add task page when goToAddtask is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToAddtask();
    expect(navigateSpy).toHaveBeenCalledWith(['/addtask']);
  });



  it('should navigate to board page when goToBoard is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToBoard();
    expect(navigateSpy).toHaveBeenCalledWith(['/board']);
  });


  it('should reset all page flags to false when resetPageFlags is called', () => {
    component.isSummaryPage = true;
    component.isBoardPage = true;
    component.isAddTaskPage = true;
    component.isContactsPage = true;

    component['resetPageFlags']();

    expect(component.isSummaryPage).toBeFalse();
    expect(component.isBoardPage).toBeFalse();
    expect(component.isAddTaskPage).toBeFalse();
    expect(component.isContactsPage).toBeFalse();
  });
});
