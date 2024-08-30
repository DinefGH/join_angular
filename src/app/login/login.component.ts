import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { LoginService } from 'src/app/auth/login.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  passwordVisible: boolean = false;
  isPasswordWrong: boolean = false;
  isUsernameWrong: boolean = false;
  rememberMe: boolean = false;

  constructor(private loginService: LoginService, private router: Router, private userService: UserService, private http: HttpClient) {}



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  

  login(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.storeToken(response.token);
  
          if (response.user) {
            this.userService.setCurrentUser(response.user); // Update UserService with the user details
          } else {
            console.log("No user details in response"); // Log if user details are missing
          }
  
          this.router.navigate(['/summary']);
          this.isPasswordWrong = false;
          this.isUsernameWrong = false;
        } else {
          console.error("Invalid response structure", response);
          this.displayErrorMessage(); // Display error message if token or response is missing
        }
      },
      error: (error) => {
        console.error("Login failed:", error);
        this.displayErrorMessage(); // Display error message on login failure
      }
    });
  }

displayErrorMessage(): void {
  this.isPasswordWrong = true;
  this.isUsernameWrong = true;
  this.resetFields();  // Reset the fields if the login fails
}

  guestLogin(): void {
    this.email = 'guest@guest.com';
    this.password = 'L!9NbQY.3V';
    this.login();
  }

  goToSignUp(): void {
    this.router.navigate(['/signup']);
  }

  private storeToken(token: string): void {
    if (this.rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  }

  private resetFields(): void {
    this.email = '';
    this.password = '';
  }
}






