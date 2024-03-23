import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { LoginService } from 'src/app/auth/login.service';



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

  constructor(private loginService: LoginService, private router: Router) {}



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  

  login(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log("Login successful, token:", response.token);
        // Decide where to store the token based on "Remember me" checkbox
        if (this.rememberMe) {
          localStorage.setItem('auth_token', response.token); // Persistent storage
        } else {
          sessionStorage.setItem('auth_token', response.token); // Session-only storage
        }
        setTimeout(() => this.router.navigate(['/summary']), 100);
        this.isPasswordWrong = false;
      },
      error: (error) => {
        console.error("Login failed:", error);
        this.isPasswordWrong = true;
      }
    });
  }

  goToSignUp(): void {
    this.router.navigate(['/signup']);
  }
}






