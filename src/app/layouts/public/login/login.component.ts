import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  trigger,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate(
          '600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-20px)' })
        ),
      ]),
    ]),
    trigger('shake', [
      transition(':enter', [
        style({ transform: 'translateX(0)' }),
        animate(
          '500ms',
          style({ transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent {
  mode: 'mobile' | 'otp' = 'mobile'; // Step controller

  mobileNumber = '';
  error = '';
  isLoading = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(private router: Router, private spinner: NgxSpinnerService) { }

  // STEP 1 → Ask Mobile Number
  sendOtp() {
    this.error = '';

    if (!this.mobileNumber || this.mobileNumber.length !== 10) {
      this.error = 'Please enter a valid 10-digit mobile number';
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      this.isLoading = false;
      this.mode = 'otp'; // Show OTP screen
    }, 1500);
  }

  // Auto move to next box
  moveNext(event: any, index: number) {
    if (event.target.value && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  // STEP 2 → Verify OTP
  verifyOtp() {
    const otp = this.otpInputs
      .toArray()
      .map((el) => el.nativeElement.value)
      .join('');

    if (otp !== '123456') {
      this.error = 'Incorrect OTP, please try again.';
      return;
    }

    this.error = '';
    this.isLoading = true;
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      this.isLoading = false;
      this.router.navigate(['/chatbox']); // Final redirect
    }, 1500);
  }
}
