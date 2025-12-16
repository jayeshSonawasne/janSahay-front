import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  title :string =  'Project Name';

  //#region ------------------------------------------------------- api urls--------------------------------------------------------//
  returnBaseUrl(url: string) {
    switch (url) {
      case 'baseUrl': return 'https://apislms.shikshandarpan.com'; break;
      case 'monitoring': return 'https://mp-dept-monitoring.mahamining.com/'; break;
      default: return ''; break;
    }
  }

  //#endregion ------------------------------------------------------- api urls-----------------------------------------------------//

  loginFlag: string = 'web';

  //--------------------------------------------------Api Path url----------------------------------------------------------------//

  dialogBoxWidth = ['320px', '800px', '700px', '1024px'];  // Set angular material dialog box width

  disableCloseBtnFlag: boolean = true// When click on body material dialog box is not closed flag

  pageSize: number = 10; // Angular material data table page size limt

  fill: string | any = 'fill'; // Reactive form fill appearance

  outline: string | any = 'outline'; // Reactive form fill filter appearance

  //------------------------------------------ Maps Settings  starte heare -------------------------------------------//

  lat = 19.0898177;

  long = 76.5240298;

  zoom: number = 8;

  viewType: string = 'roadmap';

  static googleApiObj: object = { // google api key
    //apiKey: 'AIzaSyBhkYI4LMEqVhB6ejq12wpIA6CW5theKJw', //live
    apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8', //demo
    language: 'en',
    libraries: ['drawing', 'places']
  };
}
