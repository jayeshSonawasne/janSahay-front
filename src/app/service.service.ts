import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8585';

  constructor(private http: HttpClient) {}

  async request(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    route: string,
    payload?: any,
    params?: any,
    headers?: HttpHeaders
  ): Promise<any> {

    const url = `${this.baseUrl}/${route}`;

    const options: any = {
      headers: headers || new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: this.buildParams(params),
      body: payload
    };

    return firstValueFrom(
      this.http.request(method, url, options)
    );
  }

  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return httpParams;
  }
}
