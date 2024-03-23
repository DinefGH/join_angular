import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
import { AddTaskComponent } from './add-task/add-task.component';
import { NgbModule,  NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './custom-dateparser-formatter';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { UserRegistrationService } from 'src/app/services/auth.service';
import { ContactsViewComponent } from './contacts/contacts-view/contacts-view.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';
import { ContactsAddComponent } from './contacts/contacts-add/contacts-add.component';
import { ContactsEditComponent } from './contacts/contacts-edit/contacts-edit.component'; // Adjust path as needed


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ResetPasswordComponent,
    FooterBarComponent,
    SidebarComponent,
    SummaryComponent,
    HeaderBarMobileComponent,
    AddTaskComponent,
    ContactsViewComponent,
    ContactsOverviewComponent,
    ContactsAddComponent,
    ContactsEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDatepickerModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    UserService,
    UserRegistrationService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
