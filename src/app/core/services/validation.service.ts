import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  firsteName = ('^[a-zA-Z]+$');
  onlyNumber = ('^[0-9]+$');
  fullName = ('^[a-zA-Z][a-zA-Z ]*$');
  email = ('^[a-zA-Z0-9][a-zA-Z0-9._-]+[a-zA-Z0-9]+@([a-z.]+[.])+[a-z]{2,5}$');
  mobile_No = ('[6-9]\\d{9}');
  aadhar_card = ('^[2-9][0-9]{11}$');
  password = ('^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9 \d@$!%*?&#]{8,20}$');
  latitude = ('^[+-]?(([1-8]?[0-9])(\.[0-9]{1,8})?|90(\.0{1,8})?)$');
  longitude = ('^[+-]?((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,8})?)|180(\.0{1,8})?)$');
  pin_code = ('^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$');
  alphanumeric = ('^[^\\s\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z0-9.\\s]+$');
  GstNo = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  name = '^[^\\s0-9\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z.\\s]+$'; // fname, mname, lname
  pan_card = '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}';
}