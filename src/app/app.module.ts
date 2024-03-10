import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SummaryComponent } from './summary/summary.component';
import { HeaderBarMobileComponent } from './header-bar-mobile/header-bar-mobile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ResetPasswordComponent,
    FooterBarComponent,
    SidebarComponent,
    SummaryComponent,
    HeaderBarMobileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
