import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Student } from '../model/student';
import { AppStrings } from './helper/app-strings';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

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
}
