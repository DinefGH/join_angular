import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { LoginService } from 'src/services/login.service';



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

  constructor(private loginService: LoginService, private router: Router) {}



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  

//   async onSubmit() {
//     try {
 
//       console.log(resp);
//       // Assuming the response correctly includes a token property
//       localStorage.setItem('token', resp['token']);
//       this.router.navigateByUrl('/summary'); // Navigate to '/summary' or any other desired route
//     } catch (error) {
//       console.error('Error:', error);
//       this.isPasswordWrong = true; // Set flag to show error message or handle the login error
//     }
//   }
}


