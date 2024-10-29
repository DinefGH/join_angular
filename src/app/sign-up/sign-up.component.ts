import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRegistrationService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signupSuccess = false;

  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptsPrivacyPolicy: false,
  };
  passwordVisible: boolean = false;

  constructor(
    private userRegistrationService: UserRegistrationService,
    private router: Router,
  ) {}

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

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  goToLogIn(): void {
    this.router.navigate(['/summary']);
  }
}
