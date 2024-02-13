import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppStrings } from './helper/app-strings';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { EmailVerificationService } from 'src/app/email-verification.service';
import { GoogleAuthProvider,GithubAuthProvider,FacebookAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth:AngularFireAuth,private router: Router, private emailVerificationService: EmailVerificationService ) { }

  //login method
  private userEmailKey = 'userEmail'; 
  login(email:string,password:string){
      this.fireauth.signInWithEmailAndPassword(email,password).then(res =>{
        localStorage.setItem(AppStrings.TOKEN_KEY,AppStrings.TRUE_VALUE);
        localStorage.setItem(this.userEmailKey, email);
        if(res.user?.emailVerified == true){
          this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
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


  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem(AppStrings.TOKEN_KEY);
      this.router.navigate([AppStrings.LOGIN_ROUTE]);

    },err=>{
      alert(err.message);
      
    })
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
        this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      }).catch(err => {
        alert(err.message);
      });
    }


    getUserEmail(): string {
      return localStorage.getItem(this.userEmailKey) || ''; // Retrieve user's email from localStorage
    }
  
  }