import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Student } from 'src/app/model/student';
import { DataService } from 'src/app/shared/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Import AngularFirestore from correct path
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isSidebarOpen: boolean = true;

  studentList: Student[] = [];

  StudentObj: Student = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
  };

  id: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  mobile: string = '';

  userEmail: string = '';
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private fireAuth: AngularFireAuth,
    private data: DataService,
    private afs: AngularFirestore 
  ) {}
  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    console.log(this.userEmail);
    this.getAllStudents();
  }

  onLogout(): void {
    this.authService.logout();
    localStorage.removeItem('userEmail');
    this.router.navigate([AppStrings.LOGIN_ROUTE]); // Navigate to the login page after logout
  }

  getAllStudents() {
    this.data.getAllStudnets().subscribe(
      (res) => {
        this.studentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        alert(AppStrings.ERROR_WHILE_FETCHING_STUDNET);
      }
    );
  }


  resetForm() {
    this.id = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.mobile = '';
  }


  addStudentData() {
    if (
      this.first_name == '' ||
      this.last_name == '' ||
      this.mobile == '' ||
      this.email == ''
    ) {
      alert(AppStrings.FILL_ALL_FIELDS_MESSAGE);
      return;
    }

    this.StudentObj.id = '';
    this.StudentObj.email = this.email;
    this.StudentObj.first_name = this.first_name;
    this.StudentObj.last_name = this.last_name;
    this.StudentObj.mobile = this.mobile;
    this.data.addStudent(this.StudentObj);

    this.resetForm();
  }

  
  


  updateStudent() {}


  deleteStudnet(student: Student) {
    if (
      window.confirm(
        AppStrings.CONFORMATION_DELETE_MESSAGE +
          student.first_name +
          '' +
          student.last_name +
          ' ?'
      )
    ) {
      this.data.deleteStudent(student);
    }
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
