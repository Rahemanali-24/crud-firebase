import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  constructor(private fireAuth:AngularFireAuth){}

  private isEmailVerifiedSubject = new BehaviorSubject<boolean>(false);
  isEmailVerified$ = this.isEmailVerifiedSubject.asObservable();

  setIsEmailVerified(value: boolean) {
    this.isEmailVerifiedSubject.next(value);
  }

  checkEmailVerificationStatus(): Observable<boolean> {
    return this.fireAuth.authState.pipe(
      map(user => user ? user.emailVerified : false)
    );
  }
}
