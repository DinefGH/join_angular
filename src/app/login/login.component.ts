import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordVisible: boolean = false;
  isPasswordWrong: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  validatePassword(): void {
    // Assume validate() is your method to check the password
    if (!this.validate()) {
      this.isPasswordWrong = true;
    } else {
      this.isPasswordWrong = false;
      // Proceed with your logic for a correct password
    }
  }

  // Assume this is called when the user attempts to submit the password
  onSubmit(): void {
    this.validatePassword();
  }

  // Placeholder for your validation logic
  private validate(): boolean {
    // Implement your password validation logic here
    // Return true if valid, false otherwise
    return false; // Placeholder
  }
}


