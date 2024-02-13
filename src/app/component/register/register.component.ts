import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements OnInit{
  
  email:string = '';
  password:string = '';

  constructor(private auth: AuthService){}
  
  ngOnInit(): void {
    
  }
 


  register(){
    if(this.email == ''){
      alert(AppStrings.PLEASE_ENTER_EMAIL_MESSAGE);
      return; 
    }
    if(this.password == ''){
      alert(AppStrings.PLEASE_ENTER_PASSWORD_MESSAGE);
      return; 
    }

    this.auth.register(this.email,this.password);
    this.email = '';
    this.password = '';
  }

 
}
