import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  isSidebarOpen: boolean = true;
 
  userEmail:string = '';
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
 
  
  constructor(private router: Router, private authService: AuthService,private fireAuth: AngularFireAuth) { }
  ngOnInit(): void {
    this.userEmail =this.authService.getUserEmail();
    console.log(this.userEmail);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate([AppStrings.LOGIN_ROUTE]); // Navigate to the login page after logout
  }

  async googleSignOut(): Promise<void> {
    try {
      // Sign out from Firebase
      await this.fireAuth.signOut();
  
      // Sign out from Google
      const auth2 = firebase.auth();
      await auth2.signOut();
  
      // Clear local storage and navigate to login page
      localStorage.removeItem(AppStrings.TOKEN_KEY);
      localStorage.clear();
       localStorage.removeItem('userEmail');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
 
}
