import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private apiService: ApiService) { }

  getAllState() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'dept-monitoring-api/Master/GetStateByUsersId?UserId=1', false, false, false, 'monitoring');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res.responseData) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });

  }
}
