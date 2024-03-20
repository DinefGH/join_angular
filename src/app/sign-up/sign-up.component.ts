import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptsPrivacyPolicy: false
  };

  passwordVisible: boolean = false;

  constructor(private userService: UserService) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  onSubmit(): void {
    if (this.passwordsMatch()) {
      this.userService.register(this.user).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    } else {
      console.error('Passwords do not match');
    }
  }
}

