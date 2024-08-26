import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRegistrationService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signupSuccess = false;

  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptsPrivacyPolicy: false
  };
  passwordVisible: boolean = false;

  constructor(private userRegistrationService: UserRegistrationService, private router: Router) {}

  onSubmit(): void {
    if (this.user.acceptsPrivacyPolicy) {
      // Adjust the payload to match the backend's expected structure.
      const userDataToSend = {
        name: this.user.name, // Ensure this matches the corrected model structure
        email: this.user.email,
        password: this.user.password,
        confirmPassword: this.user.confirmPassword
      };
  
      this.userRegistrationService.registerUser(userDataToSend).subscribe({
        next: (response) => {
          this.signupSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/login']); // Navigate to the login page
          }, 3000);
        },
        error: (error) => {
          console.error('There was an error!', error);
          console.error('Error response body:', error.error);
          // Optionally, log the status code and error message
          console.error(`Error status: ${error.status}, Message: ${error.message}`);
          // Here, you might show error messages to the user in the UI.
        }
      });
    } else {
      // Handle case where privacy policy is not accepted
      console.error('Privacy policy not accepted');
    }

  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }
}

