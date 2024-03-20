import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private authService: AuthService, private router: Router) {}



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  

  async onSubmit() {
    try {
      const resp = await this.authService.loginWithEmailAndPassword(this.email, this.password);
      console.log(resp);
      // Assuming the response correctly includes a token property
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/summary'); // Navigate to '/summary' or any other desired route
    } catch (error) {
      console.error('Error:', error);
      this.isPasswordWrong = true; // Set flag to show error message or handle the login error
    }
  }
}


