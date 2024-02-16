import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppStrings } from './helper/app-strings';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { EmailVerificationService } from 'src/app/email-verification.service';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import firebase from 'firebase/compat/app'; // Import firebase

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private userEmailKey = AppStrings.USER_EMAIL_MESSAGE;

  private isAuthenticated = false;
 
  private tokenKey = 'token';

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private emailVerificationService: EmailVerificationService
  ) {}

  //login method
  

  loginRoute(email: string) {
    if (email == AppStrings.ADMIN_EMAIL_MESSAGE) {
      this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
    } else {
      this.router.navigate([AppStrings.USER_DASHBOARD_MESSAGE]);
    }
  }

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        localStorage.setItem(AppStrings.TOKEN_KEY, AppStrings.TRUE_VALUE);
        localStorage.setItem(this.userEmailKey, email);
        if (res.user?.emailVerified == true) {
          this.loginRoute(email);
          this.isAuthenticated = true;
        } else {
          this.router.navigate([AppStrings.VERIFY_ROUTE]);
        }
      },
      (err) => {
        alert(err.message);
        this.router.navigate([AppStrings.LOGIN_ROUTE]);
      }
    );
  }

  //register
  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert(AppStrings.REGISTRATION_SUCCESSFUL);
        this.router.navigate([AppStrings.LOGIN_ROUTE]);
        this.SendVerficationEmail(res.user);
      },
      (err) => {
        alert(err.message);
        this.router.navigate([AppStrings.REGISTER_ROUTE]);
      }
    );
  }

  //sign out

  async logout(): Promise<void> {
    try {

      await this.fireAuth.signOut();

      localStorage.removeItem(AppStrings.TOKEN_KEY);
      localStorage.removeItem(AppStrings.USER_EMAIL_MESSAGE);
      AppStrings;

      this.isAuthenticated = false;

  
      this.router.navigate([AppStrings.LOGIN_ROUTE]);
    } catch (error: any) {
      console.error(AppStrings.ERROR_SIGN_OUT_MESSAGE, error);
      alert(error.message);
    }
  }

  //forgot password

  forgotPassword(email: string) {
    this.fireAuth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate([AppStrings.VERIFY_ROUTE]);
      },
      (err) => {
        alert(AppStrings.SOMETHING_WENT_WRONG_MESSAGE);
      }
    );
  }

  SendVerficationEmail(user: any) {
    this.fireAuth.currentUser
      .then((u) => u?.sendEmailVerification())
      .then(
        (res: any) => {
          this.router.navigate([AppStrings.VERIFY_ROUTE]);
          this.emailVerificationService.setIsEmailVerified(false); // Set email verification status to false
        },
        (err: any) => {
          alert(AppStrings.SOMETHING_WENT_WRONG_NOT_ABLE_TO_SEND_MESSAGE);
        }
      );
  }

  isEmailVerified(): Observable<boolean> {
    return this.fireAuth.authState.pipe(
      map((user) => (user ? user.emailVerified : false))
    );
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: AppStrings.SELECT_ACCOUNT_MESSAGE });
    return this.fireAuth
      .signInWithPopup(provider)
      .then((res) => {
        localStorage.setItem(
          AppStrings.TOKEN_MESSAGE,
          JSON.stringify(res.user?.uid)
        );
        const email = res.user?.email;
        if (email == AppStrings.ADMIN_EMAIL_MESSAGE) {
          localStorage.setItem(this.userEmailKey, email); // Store the user's email in localStorage
          this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
          this.isAuthenticated = true;
        } else {
          this.router.navigate([AppStrings.USER_DASHBOARD_MESSAGE]);
          localStorage.setItem(
            AppStrings.TOKEN_MESSAGE,
            JSON.stringify(res.user?.uid)
          );
          this.isAuthenticated = true;
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  getUserEmail(): string {
    return localStorage.getItem(this.userEmailKey) || ''; // Retrieve user's email from localStorage
  }

  isAuthenticatedUser(): boolean {
    const token = this.getToken();

    if (token && token !== '') {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  
    return this.isAuthenticated;
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

 

}
