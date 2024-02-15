import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent  implements OnInit{
  // userData: any; // Define your user data type here
  
  userData: any = [];

 

  async getData() {
    this.userData = await this.dataService.getDataByEmail();
    console.log(this.userData);
  }

  constructor(private authService:AuthService,private router:Router,private dataService: DataService){}
  
  ngOnInit(): void {
    this.getData();
  }


  onLogout(): void {
    this.authService.logout();
    localStorage.removeItem('userEmail');
    this.router.navigate([AppStrings.LOGIN_ROUTE]); // Navigate to the login page after logout
  }



  
}
