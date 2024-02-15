import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { AppStrings } from './shared/helper/app-strings';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { AuthGuard, PermissionsService } from './guards/auth.guard';

const routes: Routes = [


  {path: AppStrings.LOGIN_MESSAGE,redirectTo: AppStrings.LOGIN_MESSAGE,pathMatch: AppStrings.FULL_MESSAGE},
  {path: AppStrings.LOGIN_MESSAGE,component: LoginComponent},
  {path: AppStrings.DASHBOARD_MESSAGE,canActivate: [PermissionsService] ,component: DashboardComponent},
  {path: AppStrings.REGISTER_MESSAGE,component: RegisterComponent},
  { path: AppStrings.VERIFY_EMAIL_MESSAGE, component: VerifyEmailComponent } ,
  { path: AppStrings.FORGOT_PASSWORD_MESSAGE, component: ForgotPasswordComponent } ,
  
  { path: AppStrings.USER_DASHBOARD_MESSAGE,canActivate: [PermissionsService], component: UserDashboardComponent } ,
  
  { path: '**', redirectTo: AppStrings.LOGIN_ROUTE }, // Redirect to login for any other route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
