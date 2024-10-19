import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { LoginService } from 'src/app/auth/login.service';
import { UserService } from 'src/app/services/user.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['setCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule  // <-- Add FormsModule here
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('should navigate to sign-up page when goToSignUp is called', () => {
    component.goToSignUp();
    expect(router.navigate).toHaveBeenCalledWith(['/signup']);
  });



  it('should handle successful login and store token', () => {
    const mockResponse = {
      token: 'dummy-token',
      user: { id: 1, name: 'John Doe', email: 'john@example.com' },
    };
    loginService.login.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.password = 'password';
    component.login();

    expect(loginService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(userService.setCurrentUser).toHaveBeenCalledWith(mockResponse.user);
    expect(router.navigate).toHaveBeenCalledWith(['/summary']);
    expect(component.isPasswordWrong).toBeFalse();
    expect(component.isUsernameWrong).toBeFalse();
  });



  it('should handle login failure and display error message', () => {
    loginService.login.and.returnValue(throwError({ status: 401 }));

    component.email = 'wrong@example.com';
    component.password = 'wrongpassword';
    component.login();

    expect(component.isPasswordWrong).toBeTrue();
    expect(component.isUsernameWrong).toBeTrue();
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });



  it('should store token in sessionStorage if rememberMe is false', () => {
    const mockResponse = { token: 'dummy-token', user: { id: 1, name: 'John Doe', email: 'john@example.com' } };
    loginService.login.and.returnValue(of(mockResponse));
  
    // Clear sessionStorage and localStorage before the test to ensure it's clean
    sessionStorage.clear();
    localStorage.clear();
  
    component.rememberMe = false;
    component.email = 'test@example.com';
    component.password = 'password';
    component.login();
  
    // Check if the token is stored in sessionStorage and not in localStorage
    expect(sessionStorage.getItem('auth_token')).toEqual('dummy-token');
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should store token in localStorage if rememberMe is true', () => {
    const mockResponse = { token: 'dummy-token', user: { id: 1, name: 'John Doe', email: 'john@example.com' } };
    loginService.login.and.returnValue(of(mockResponse));
  
    // Clear sessionStorage and localStorage before the test
    sessionStorage.clear();
    localStorage.clear();
  
    // Spy on localStorage.setItem to monitor its behavior
    const localStorageSpy = spyOn(localStorage, 'setItem').and.callThrough();
  
    component.rememberMe = true;
    component.email = 'test@example.com';
    component.password = 'password';
    component.login();
  
    // Check if the token is stored in localStorage and not in sessionStorage
    expect(localStorageSpy).toHaveBeenCalledWith('auth_token', 'dummy-token');
    expect(sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('should autofill guest credentials on guest login', () => {
    spyOn(component, 'login');

    component.guestLogin();

    expect(component.email).toBe('guest@guest.com');
    expect(component.password).toBe('L!9NbQY.3V');
    expect(component.login).toHaveBeenCalled();
  });
});
