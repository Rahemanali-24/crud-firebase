import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppStrings } from './helper/app-strings';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { EmailVerificationService } from 'src/app/email-verification.service';
import { GoogleAuthProvider,GithubAuthProvider,FacebookAuthProvider } from 'firebase/auth';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth:AngularFireAuth,private router: Router, private emailVerificationService: EmailVerificationService ) { }

  //login method
  private userEmailKey = 'userEmail'; 
 
  private isAuthenticated = false;


  loginRoute(email:string){
    if(email == "rahemaniflair@gmail.com"){
      this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
     }else{
      this.router.navigate([AppStrings.USER_DASHBOARD_MESSAGE]);
     }
  }


  login(email:string,password:string){
      this.fireauth.signInWithEmailAndPassword(email,password).then(res =>{
        localStorage.setItem(AppStrings.TOKEN_KEY,AppStrings.TRUE_VALUE);
        localStorage.setItem(this.userEmailKey, email);
        if(res.user?.emailVerified == true){
 
          this.loginRoute(email);
          this.isAuthenticated = true;

          
        }else{
          this.router.navigate([AppStrings.VERIFY_ROUTE]);
        }

      },err =>{
        alert(err.message);
        this.router.navigate([AppStrings.LOGIN_ROUTE]);
      });
  }

//register
   register(email:string, password: string){
     this.fireauth.createUserWithEmailAndPassword(email,password).then( res =>{   
        alert(AppStrings.REGISTRATION_SUCCESSFUL);
        this.router.navigate([AppStrings.LOGIN_ROUTE]);
        this.SendVerficationEmail(res.user);

    },err =>{
      alert(err.message);
      this.router.navigate([AppStrings.REGISTER_ROUTE]);
    })
  }


 //sign out


 async logout(): Promise<void> {
  try {
    // Sign out from Firebase
    await this.fireauth.signOut();

    // Clear local storage
    localStorage.removeItem(AppStrings.TOKEN_KEY);
    localStorage.removeItem('userEmail');

    this.isAuthenticated = false;
    
    // Navigate to login page
    this.router.navigate([AppStrings.LOGIN_ROUTE]);
  } catch (error:any) {
    console.error('Error signing out:', error);
    alert(error.message);
  }
}



  //forgot password

    forgotPassword(email : string){
      this.fireauth.sendPasswordResetEmail(email).then(()=>{
        this.router.navigate([AppStrings.VERIFY_ROUTE]);
      },err=>{
        alert(AppStrings.SOMETHING_WENT_WRONG_MESSAGE);
      })
    }

    SendVerficationEmail(user: any){
      this.fireauth.currentUser.then(u => u?.sendEmailVerification())
        .then((res:any) =>{
          this.router.navigate([AppStrings.VERIFY_ROUTE]);
          this.emailVerificationService.setIsEmailVerified(false); // Set email verification status to false
        }, (err: any) =>{
          alert(AppStrings.SOMETHING_WENT_WRONG_NOT_ABLE_TO_SEND_MESSAGE);
        });
    }

    isEmailVerified(): Observable<boolean> {
      return this.fireauth.authState.pipe(
        map(user => user ? user.emailVerified : false)
      );
    }
  
    //sign in with google

    // googleSignIn(){
    //   return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res =>{

    //     this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
    //     localStorage.setItem('token',JSON.stringify(res.user?.uid));

    //   },err=>{
    //     alert(err.message);
    //   });
    // }


    googleSignIn() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' }); 
      return this.fireauth.signInWithPopup(provider).then(res => {
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
        const email = res.user?.email;
        if (email == "rahemaniflair@gmail.com") {
          localStorage.setItem(this.userEmailKey, email); // Store the user's email in localStorage
          this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
          this.isAuthenticated=true
        }else{
          this.router.navigate([AppStrings.USER_DASHBOARD_MESSAGE]);
          localStorage.setItem('token', JSON.stringify(res.user?.uid));
          this.isAuthenticated=true
        }

      
        
       
      }).catch(err => {
        alert(err.message);
      });
    }


    getUserEmail(): string {
      return localStorage.getItem(this.userEmailKey) || ''; // Retrieve user's email from localStorage
    }

    isAuthenticatedUser(): boolean {
      return this.isAuthenticated;
    }
  }
