import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Student } from '../model/student';
import { AppStrings } from './helper/app-strings';
import { Observable } from 'rxjs';
import { collection, getDocs, query } from 'firebase/firestore';
import { Query } from '@firebase/firestore-types'
import {  where } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class DataService {



  constructor(private afs: AngularFirestore,private firestore:AngularFirestore) { }

  //add student


  addStudent(student: Student){
    student.id  = this.afs.createId();
    return this.afs.collection(AppStrings.STUDENT_COLLECTION_NAME).add(student);
  }


  //get all studnents

  getAllStudnets(){
    return this.afs.collection(AppStrings.STUDENT_COLLECTION_NAME).snapshotChanges();
  }

  //delete student
  deleteStudent(student:Student){
    return  this.afs.doc(AppStrings.STUDENT_COLLECTION_NAME_WITHID +student.id).delete();
}

  //update student

  updateStudent(student: Student){
    this.deleteStudent(student);
    this.addStudent(student);
  }


  // getDataByEmail(userEmail: string): Observable<Student | undefined> {
  //   return this.firestore.collection('Students').doc<Student>(userEmail).valueChanges();
  // }



  // async getDataByEmail(userEmail: string): Promise<any[]> {
  //   const querySnapshot = await getDocs(collection(this.afs.firestore, 'Students'));
  //   console.log(querySnapshot.docs.map((doc) => doc.data()));
  //   return querySnapshot.docs.map((doc) => doc.data());

  // }

 
}
