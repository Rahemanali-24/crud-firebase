import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  email:string = '';
  password:string = '';

  constructor(private auth : AuthService){}

  ngOnInit(): void {
    
  }

  login(){

    if(this.email == ''){
      alert(AppStrings.PLEASE_ENTER_EMAIL_MESSAGE);
      return; 
    }
    if(this.password == ''){
      alert(AppStrings.PLEASE_ENTER_PASSWORD_MESSAGE);
      return; 
    }

    this.auth.login(this.email,this.password);
    this.email = '';
    this.password = '';

  }

  signInWithGoogle(){
      this.auth.googleSignIn();
  }
}
