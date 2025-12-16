import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { DatePipe, Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class CommonMethodService {
  private readonly ENCRYPTION_KEY = "8080808080808080";
  private captchaText!: string;

  constructor(
    private matSnackBar: MatSnackBar,
    private datePipe: DatePipe,
    public location: Location
  ) { }

  /**
   * Displays a snackbar notification
   * @param message - The message to display
   * @param status - 0: success, 1: danger, 2: warning
   */
  snackBar(message: string, status: 0 | 1 | 2): void {
    const snackbarClasses = ['snack-success', 'snack-danger', 'snack-warning'];
    this.matSnackBar.open(message, " ", {
      duration: 3000,
      panelClass: [snackbarClasses[status]],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  //#region Encryption and Decryption Methods

  /**
   * Encrypts data using AES-256 encryption
   * @param data - The data to encrypt
   * @returns Encrypted string
   */
  encryptUsingAES256(data: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.ENCRYPTION_KEY);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      keySize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  /**
   * Decrypts data using AES-256 decryption
   * @param encryptedData - The encrypted data to decrypt
   * @returns Decrypted string
   */
  decryptUsingAES256(encryptedData: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.ENCRYPTION_KEY);
    return CryptoJS.AES.decrypt(encryptedData, key, {
      keySize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  //#endregion

  //#region Captcha Methods

  /**
   * Creates and displays a captcha canvas element
   */
  createCaptchaText(): void {
    const captchaContainer = document.getElementById('captcha');
    if (!captchaContainer) return;

    captchaContainer.innerHTML = "";
    const characters = "0123456789";
    const captchaLength = 6;
    const captchaChars: string[] = [];

    // Generate unique random characters
    for (let i = 0; i < captchaLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      if (!captchaChars.includes(characters[randomIndex])) {
        captchaChars.push(characters[randomIndex]);
      } else {
        i--;
      }
    }

    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.id = "captcha1";
    canvas.width = 160;
    canvas.height = 36;

    const context = canvas.getContext("2d");
    if (context) {
      context.font = "24px Georgia";
      context.fillText(captchaChars.join(""), 26, 26);
    }

    this.captchaText = captchaChars.join("");
    captchaContainer.appendChild(canvas);
  }

  /**
   * Returns the generated captcha text
   */
  getCaptchaText(): string {
    return this.captchaText;
  }

  //#endregion

  //#region Date Transformation Methods

  /**
   * Transforms date to ISO format with time (YYYY-MM-DDTHH:mm:ss.msZ)
   */
  transformDateWithTime(dateTime: Date | string): string | null {
    const dateWithTime = this.datePipe.transform(dateTime, 'yyyy-MM-ddTHH:mm:ss.ms');
    return dateWithTime ? dateWithTime + "Z" : null;
  }

  /**
   * Transforms date to YYYY-MM-DD format
   */
  transformDate(dateTime: Date | string): string | null {
    return this.datePipe.transform(dateTime, 'yyyy-MM-dd');
  }

  /**
   * Displays date in DD-MM-YYYY format
   */
  displayDate(dateTime: Date | string): string | null {
    return this.datePipe.transform(dateTime, 'dd-MM-yyyy');
  }

  /**
   * Displays date and time in DD-MM-YYYY hh:mm AM/PM format
   */
  displayDateTime(dateTime: Date | string): string | null {
    return this.datePipe.transform(dateTime, 'dd-MM-yyyy hh:mm a');
  }

  //#endregion

  //#region Utility Methods

  /**
   * Gets the trigger value from a mat-select event
   */
  getSelectedTriggerValue(event: any): string {
    return event.source.triggerValue;
  }

  /**
   * Navigates back to the previous location
   */
  goBackToLocation(): void {
    this.location.back();
  }

  /**
   * Checks if a value has meaningful content
   * @param value - The value to check
   * @returns true if value has content, false otherwise
   */
  hasValue(value: any): boolean {
    return value !== "" &&
      value !== null &&
      value !== "null" &&
      value !== undefined &&
      value !== "undefined" &&
      value !== 'string' &&
      value !== 0;
  }

  /**
   * Extracts the current page name from the URL path
   */
  getPathName(): string {
    const pathname = window.location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const pageName = pathname.substring(lastIndex);
    return pageName.split('/')[1];
  }

  /**
   * Masks a mobile number for privacy (shows only first 2 and last 2 digits)
   * @param mobileNumber - The mobile number to mask
   * @returns Masked mobile number (e.g., "12******89") or "-" if invalid
   */
  maskMobileNumber(mobileNumber: string): string {
    if (typeof mobileNumber === 'string' && mobileNumber.length === 10) {
      return mobileNumber.slice(0, 2) + '******' + mobileNumber.slice(8);
    }
    return '-';
  }

  /**
   * Returns 0 for numbers, '-' for other types
   */
  getDefaultValueByType(data: any): number | string {
    return typeof data === 'number' ? 0 : '-';
  }

  //#endregion
}
