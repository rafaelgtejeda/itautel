import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseUrlL: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ApplicationId': 'RafaelTejeda',
      // "Authorization": `Bearer ${this.cookieService.get("access_token")}`
    }),
  }
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private cookieService: CookieService) {
      this.baseUrlL = baseUrl;
  }

  public get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrlL}${endpoint}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  public post(endpoint: string, parameters: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApplicationId': 'RafaelTejeda',
    });

    return this.http.post<any>(`${this.baseUrlL}${endpoint}`, parameters, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  public put(endpoint: string, parameters: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApplicationId': 'RafaelTejeda',
    });

    return this.http.put<any>(`${this.baseUrlL}${endpoint}`, parameters, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('ocorreu um erro:', error.error.message);
    } else {
      console.error(
        `api retornou o status: ${error.status}, ` +
        `corpo da mensagem: ${error.error}`);
    }
    return throwError(error);
  };

}
