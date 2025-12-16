import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

interface HttpRequestOptions {
  headers?: HttpHeaders;
  body?: any;
  params?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpRequest: {
    method: string;
    url: string;
    options: HttpRequestOptions;
  } = {
      method: '',
      url: '',
      options: {}
    };

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  /**
   * Executes the configured HTTP request
   * @returns Observable of the HTTP response
   */
  executeRequest(): Observable<any> {
    // Clean up undefined options
    if (!this.httpRequest.options.body) {
      delete this.httpRequest.options.body;
    }
    if (!this.httpRequest.options.params) {
      delete this.httpRequest.options.params;
    }

    return this.http.request(
      this.httpRequest.method,
      this.httpRequest.url,
      this.httpRequest.options
    );
  }

  /**
   * Configures an HTTP request with the specified parameters
   * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param endpoint - API endpoint path
   * @param includeHeaders - Whether to include default headers
   * @param requestBody - Optional request body
   * @param queryParams - Optional query parameters
   * @param baseUrlKey - Key to identify which base URL to use
   */
  configureRequest(
    method: string,
    endpoint: string,
    includeHeaders: boolean,
    requestBody?: any,
    queryParams?: any,
    baseUrlKey?: any
  ): void {
    this.clearRequest();

    this.httpRequest.method = method;
    this.httpRequest.url = this.configService.returnBaseUrl(baseUrlKey) + endpoint;

    if (includeHeaders) {
      const headers = {
        'Content-Type': 'application/json'
        // Add authorization header when needed:
        // 'Authorization': 'Bearer ' + token
      };
      this.httpRequest.options.headers = new HttpHeaders(headers);
    }

    if (requestBody !== undefined && requestBody !== null) {
      this.httpRequest.options.body = requestBody;
    }

    if (queryParams !== undefined && queryParams !== null) {
      this.httpRequest.options.params = queryParams;
    }
  }

  /**
   * Clears the current HTTP request configuration
   */
  private clearRequest(): void {
    this.httpRequest.method = '';
    this.httpRequest.url = '';
    this.httpRequest.options = {};
  }

  //#region Backward Compatibility Methods (Deprecated - use configureRequest and executeRequest instead)

  /**
   * @deprecated Use configureRequest() instead
   * Legacy method for backward compatibility
   */
  setHttp(type: string, url: string, isHeader: boolean, obj: any, params: any, baseUrl: any): void {
    this.configureRequest(type, url, isHeader, obj, params, baseUrl);
  }

  /**
   * @deprecated Use executeRequest() instead
   * Legacy method for backward compatibility
   */
  getHttp(): Observable<any> {
    return this.executeRequest();
  }

  /**
   * @deprecated Use clearRequest() instead (now private)
   * Legacy method for backward compatibility
   */
  clearHttp(): void {
    this.clearRequest();
  }

  //#endregion
}
