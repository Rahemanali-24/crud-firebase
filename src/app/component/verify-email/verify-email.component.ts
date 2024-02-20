import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { EmailVerificationService } from 'src/app/email-verification.service';
import { AppStrings } from 'src/app/shared/helper/app-strings';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private emailVerificationSubscription?: Subscription;

  constructor(private router: Router, private emailVerificationService: EmailVerificationService) { }

  ngOnInit(): void {
    this.emailVerificationSubscription = this.emailVerificationService.isEmailVerified$.subscribe(isVerified => {
      if (isVerified) {
        this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
      } else {
        this.pollEmailVerificationStatus();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.emailVerificationSubscription) {
      this.emailVerificationSubscription.unsubscribe();
    }
  }


  private pollEmailVerificationStatus(): void {
    const pollInterval = 1000; // 1 second
    interval(pollInterval).subscribe(() => {
      this.emailVerificationService.checkEmailVerificationStatus().subscribe(isVerified => {
        if (isVerified) {
          this.router.navigate([AppStrings.DASHBOARD_ROUTE]);
        }
      });
    });
  }
}
