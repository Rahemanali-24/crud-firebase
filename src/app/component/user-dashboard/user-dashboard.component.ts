import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';
import { PlatformLocation } from '@angular/common';

// Declare a subscription property
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  // userData: any; // Define your user data type here

  // userData: any = [];
  tasks?: any[];

  // async getData() {
  //   this.userData = await this.dataService.getDataByEmail();
  //   console.log(this.userData);
  // }

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private platformLocation: PlatformLocation
  ) {}

  ngOnInit(): void {
    history.pushState(null, '', location.href);
    this.platformLocation.onPopState(() => {
      history.pushState(null, '', location.href);
    });

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection(AppStrings.STUDENTS_ROUTE, (ref) =>
            ref.where(AppStrings.EMAIL_MESSAGE, '==', user.email)
          )
          .valueChanges()
          .subscribe((tasks) => {
            this.tasks = tasks;
          });
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    localStorage.removeItem(AppStrings.USER_EMAIL_MESSAGE);
    this.router.navigate([AppStrings.LOGIN_ROUTE]); // Navigate to the login page after logout
  }
}
