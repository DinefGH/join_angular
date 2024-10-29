import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderBarMobileComponent } from './header-bar-mobile.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'src/assets/models/user.model';

describe('HeaderBarMobileComponent', () => {
  let component: HeaderBarMobileComponent;
  let fixture: ComponentFixture<HeaderBarMobileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  // Mock user object following the User interface
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [HeaderBarMobileComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderBarMobileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set userInitial on ngOnInit when user is present', () => {
    userService.getCurrentUser.and.returnValue(of(mockUser)); // Mock the service call to return the mock user

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.userInitial).toBe('J'); // Expect the first character of the user's name
  });

  it('should toggle the dropdown state when toggleDropdown is called', () => {
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeTrue();

    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeFalse();
  });

  it('should call the router.navigateByUrl on logout', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.logout();

    expect(navigateSpy).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
  });
});
