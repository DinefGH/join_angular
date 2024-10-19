import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { UserRegistrationService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let userRegistrationService: jasmine.SpyObj<UserRegistrationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userRegistrationServiceSpy = jasmine.createSpyObj('UserRegistrationService', ['registerUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [FormsModule], // Use FormsModule for ngModel
      providers: [
        { provide: UserRegistrationService, useValue: userRegistrationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    userRegistrationService = TestBed.inject(UserRegistrationService) as jasmine.SpyObj<UserRegistrationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should log an error and not call registerUser when privacy policy is not accepted', () => {
    spyOn(console, 'error');

    component.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      acceptsPrivacyPolicy: false
    };

    component.onSubmit();

    expect(userRegistrationService.registerUser).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Privacy policy not accepted');
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('should correctly validate if passwords match', () => {
    component.user.password = 'password123';
    component.user.confirmPassword = 'password123';
    expect(component.passwordsMatch()).toBeTrue();

    component.user.confirmPassword = 'password456';
    expect(component.passwordsMatch()).toBeFalse();
  });

  it('should handle registration error', () => {
    spyOn(console, 'error');

    const mockError = {
      status: 400,
      message: 'Registration failed',
      error: { detail: 'Invalid data' }
    };
    userRegistrationService.registerUser.and.returnValue(throwError(mockError));

    component.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      acceptsPrivacyPolicy: true
    };

    component.onSubmit();

    expect(userRegistrationService.registerUser).toHaveBeenCalled();
    expect(component.signupSuccess).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('There was an error!', mockError);
    expect(console.error).toHaveBeenCalledWith('Error response body:', mockError.error);
    expect(console.error).toHaveBeenCalledWith(`Error status: ${mockError.status}, Message: ${mockError.message}`);
  });



  it('should submit the form and call the registerUser method when privacy policy is accepted', fakeAsync(() => {
    // Arrange
    component.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      acceptsPrivacyPolicy: true
    };
  
    const mockResponse = { success: true };
    userRegistrationService.registerUser.and.returnValue(of(mockResponse)); // Simulating successful response
  
    // Act
    component.onSubmit();  // Call the method that triggers the registration
  
    // Flush any asynchronous operations (e.g., HTTP call)
    tick();
  
    // Use flush() to clear all pending timers
    flush();
  
    // Assert
    expect(userRegistrationService.registerUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
  
    expect(component.signupSuccess).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Ensure navigation is called
  }));
  
});
