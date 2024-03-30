import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './/login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ContactsOverviewComponent } from './contacts/contacts-overview/contacts-overview.component';
import { ContactsViewComponent } from './contacts/contacts-view/contacts-view.component';


import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'summary', component: SummaryComponent, canActivate: [AuthGuard]},
  {path: 'addtask', component: AddTaskComponent, canActivate: [AuthGuard]},
  {path: 'contacts', component: ContactsOverviewComponent, canActivate: [AuthGuard]},
  {path: 'contacts-detail/:id', component: ContactsViewComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
