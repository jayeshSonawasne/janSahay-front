import { Injectable } from '@angular/core';
import { CommonMethodService } from './common-method.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  userId!: number;
  userName!: string;
  selLanguage = new BehaviorSubject<string>('English');
  breadCrumbObs = new BehaviorSubject<string[]>([]);

  constructor(private commonMethodService: CommonMethodService) { }

  userIsLoggedIn() {
    if (localStorage.getItem('projectName')) {
      return true
    } else {
      return false
    }
  }

  getProjectData() {
    if (this.userIsLoggedIn()) {
      var decryptData = JSON.parse(this.commonMethodService.decryptUsingAES256(localStorage['projectName']));
      let data = decryptData;
      return data;
    }
  }

  assignProjectData() {
    let data: any = this.getProjectData();
    this.userId = JSON.parse(data).responseData[0].id;
    this.userName = JSON.parse(data).responseData[0].name;
  }


  getAllPageName() {
    let data: any = this.getProjectData();
    return data?.responseData?.userAccessPages;
  }

  onCheckReadWriteDelete(viewFlag: boolean, editFlag: boolean, deleteFlag: boolean) {
    let pageName = this.commonMethodService.getPathName();
    let allPages: any = this.getAllPageName()?.find((x: any) => x.pageURL == pageName);
    return [{ name: '', icon: 'visibility', action: viewFlag ? 'View' : '', class: 'bg-dark-subtle text-dark', isdisable: allPages?.readRight ? allPages?.readRight : true }, { name: '', icon: 'edit_square', action: editFlag ? 'Edit' : '', class: ' bg-primary-subtle text-primary', isdisable: allPages?.writeRight ? allPages?.writeRight : true }, { name: '', icon: 'delete', action: deleteFlag ? 'Delete' : '', class: 'bg-danger-subtle text-danger', isdisable: allPages?.deleteRight ? allPages?.deleteRight : true }]
  }
}
