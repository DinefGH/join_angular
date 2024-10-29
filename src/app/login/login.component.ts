import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/auth/login.service';
import { UserService } from 'src/app/services/user.service';


/**
 * LoginComponent handles user authentication by managing login credentials,
 * visibility of the password, and error messages. It also allows guest login and
 * redirects upon successful login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  /** Stores the entered email address for login. */
  email: string = '';

  /** Stores the entered password for login. */
  password: string = '';

  /** Controls visibility of the password field. */
  passwordVisible: boolean = false;

  /** Tracks if an incorrect password error is displayed. */
  isPasswordWrong: boolean = false;

  /** Tracks if an incorrect username error is displayed. */
  isUsernameWrong: boolean = false;

  /** Determines if the authentication token should be stored persistently. */
  rememberMe: boolean = false;


    /**
   * Constructor to inject necessary services for login, user management, and navigation.
   * @param loginService - Service for handling login requests.
   * @param router - Router for navigation.
   * @param userService - Service for managing user data.
   * @param http - HttpClient for making HTTP requests.
   */
  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
  ) {}


    /** Toggles the visibility of the password field. */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


    /**
   * Attempts to log the user in using the provided credentials.
   * Upon successful login, stores the token and navigates to the Summary page.
   */
  login(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: response => {
        if (response && response.token) {
          this.storeToken(response.token);

          if (response.user) {
            this.userService.setCurrentUser(response.user); 
          } else {
            console.log('No user details in response'); 
          }

          this.router.navigate(['/summary']);
          this.isPasswordWrong = false;
          this.isUsernameWrong = false;
        } else {
          console.error('Invalid response structure', response);
          this.displayErrorMessage(); 
        }
      },
      error: error => {
        console.error('Login failed:', error);
        this.displayErrorMessage(); 
      },
    });
  }


    /**
   * Displays an error message indicating incorrect username or password.
   * Resets the input fields to blank.
   */
  displayErrorMessage(): void {
    this.isPasswordWrong = true;
    this.isUsernameWrong = true;
    this.resetFields(); 
  }


    /**
   * Logs in as a guest user by setting predefined credentials.
   */
  guestLogin(): void {
    this.email = 'guest@guest.com';
    this.password = 'L!9NbQY.3V';
    this.login();
  }


    /** Navigates to the sign-up page. */
  goToSignUp(): void {
    this.router.navigate(['/signup']);
  }


    /**
   * Stores the authentication token in either localStorage or sessionStorage,
   * based on the "Remember Me" selection.
   * @param token - The authentication token to store.
   */
  private storeToken(token: string): void {
    if (this.rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  }


    /** Clears the email and password fields. */
  private resetFields(): void {
    this.email = '';
    this.password = '';
  }


    /** Navigates directly to the Summary page after logging in. */
  goToLogIn(): void {
    this.router.navigate(['/summary']);
  }
}
