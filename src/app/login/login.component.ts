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
  rememberMe: boolean = false;

  constructor(private loginService: LoginService, private router: Router, private userService: UserService) {}



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  

  login(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log("Full login response:", response);
        console.log("Login successful, token:", response.token);
        this.storeToken(response.token);

        if (response.user) {
          console.log("User details received:", response.user); // Log the user details
          this.userService.setCurrentUser(response.user); // Update UserService with the user details
        } else {
          console.log("No user details in response"); // Log if user details are missing
        }

        this.router.navigate(['/summary']);
        this.isPasswordWrong = false;
      },
      error: (error) => {
        console.error("Login failed:", error);
        this.isPasswordWrong = true;
      }
    });
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
}






