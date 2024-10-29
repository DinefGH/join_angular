import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRegistrationService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


/**
 * SignUpComponent handles user registration, including form validation,
 * password visibility toggling, and submission to the server.
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {


    /** Indicates if the signup was successful, used to show success message. */
  signupSuccess = false;

  /** Object to hold user registration data. */
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptsPrivacyPolicy: false,
  };

    /** Controls the visibility of the password field. */
  passwordVisible: boolean = false;


    /**
   * Constructor to inject the UserRegistrationService and Router for navigation.
   * @param userRegistrationService - Service to handle user registration.
   * @param router - Router to navigate after registration.
   */
  constructor(
    private userRegistrationService: UserRegistrationService,
    private router: Router,
  ) {}


    /**
   * Submits the signup form if the privacy policy is accepted.
   * On successful registration, navigates to the login page.
   */
  onSubmit(): void {
    if (this.user.acceptsPrivacyPolicy) {
      const userDataToSend = {
        name: this.user.name, 
        email: this.user.email,
        password: this.user.password,
        confirmPassword: this.user.confirmPassword,
      };

      this.userRegistrationService.registerUser(userDataToSend).subscribe({
        next: response => {
          this.signupSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: error => {
          console.error('There was an error!', error);
          console.error('Error response body:', error.error);
          console.error(`Error status: ${error.status}, Message: ${error.message}`);
        },
      });
    } else {
      console.error('Privacy policy not accepted');
    }
  }


  /** Toggles the visibility of the password field. */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  /**
   * Checks if the password and confirm password fields match.
   * @returns Boolean indicating if passwords match.
   */
  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }


    /** Navigates to the Summary page. */
  goToLogIn(): void {
    this.router.navigate(['/summary']);
  }
}
