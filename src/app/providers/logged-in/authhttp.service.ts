import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map, take, retryWhen } from 'rxjs/operators';
import { genericRetryStrategy } from '../../util/genericRetryStrategy';
import { saveAs } from 'file-saver';
// service
import { EventService } from '../event.service';
import { AuthService } from '../auth.service';
import {TranslateLabelService} from '../translate-label.service';


@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  constructor(
    private _http: HttpClient,
    public _auth: AuthService,
    public _alertCtrl: AlertController,
    public eventService: EventService,
    public translateService: TranslateLabelService
  ) { }

  /**
   * Download card zip containing employer images and QR images
   * @param endpointUrl
   * @param params
   * @param filename
   */
  generateCards(endpointUrl: string, params: any, filename: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const bearerToken = this._auth.getAccessToken();

    return this._http.post(url, params, {
      responseType: 'blob', // ResponseContentType.Blob,  https://github.com/angular/angular/issues/18654#issuecomment-321947661
      headers: new HttpHeaders({
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + bearerToken
      })
    }).pipe(
      // retryWhen(genericRetryStrategy()),
      catchError((err) => {
        return this._handleError(err);
      }),
      // take(1),
      map((response) => {
        const blob = new Blob([response], { 
          type: 'application/zip' 
        });
        // file name to dowanload/generate invoice
        saveAs(blob, filename);
      })
    );
  }

  /**
   * Requests via GET verb
   * @param {string} endpointUrl
   * @returns {Observable<any>}
   */
  getRaw(endpointUrl: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const headers = this._buildAuthHeaders();
    // https://www.techiediaries.com/angular-httpclient-headers-full-response/
    return this._http.get(url, { headers, observe: 'response' })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res: HttpResponse<any>) => res)
      );
  }

  /**
   * Requests via GET verb
   * @param {string} endpointUrl
   * @returns {Observable<any>}
   */
  get(endpointUrl: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const headers = this._buildAuthHeaders();

    return this._http.get(url, { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res: HttpResponse<any>) => res )
      );
  }

  /**
   * Requests via PDF GET verb
   * @param {string} endpointUrl
   * @param {string} filename
   * @returns {Observable<any>}
   */
  pdfget(endpointUrl: string, filename: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const bearerToken = this._auth.getAccessToken();

    return this._http.get(url, {
      responseType: 'blob', // ResponseContentType.Blob,  https://github.com/angular/angular/issues/18654#issuecomment-321947661
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Currency': this._auth.currency_pref,
        Authorization: 'Bearer ' + bearerToken
      })
    }).pipe(
      retryWhen(genericRetryStrategy()),
      map((response) => { // download file
        let blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, filename); // file name to dowanload/generate invoice
      })
    );
  }

  /**
   * Requests via Excel GET verb
   * @param {string} endpointUrl
   * @param {number} invoice_id
   * @returns {Observable<any>}
   */
  excelget(endpointUrl: string, filename: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const bearerToken = this._auth.getAccessToken();

    return this._http.get(url, {
      responseType: 'blob', // ResponseContentType.Blob,  https://github.com/angular/angular/issues/18654#issuecomment-321947661
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Currency': this._auth.currency_pref,
        Authorization: 'Bearer ' + bearerToken
      })
    }).pipe(
      // retryWhen(genericRetryStrategy()),
      catchError((err) => {
        return this._handleError(err);
      }),
      // take(1),
      map((response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // file name to dowanload/generate invoice
        saveAs(blob, filename);

        // const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // // file name to download/generate invoice
        // saveAs(blob, filename);
      })
    );
    // .map(
    // (response) => { // download file
    //   var blob = new Blob([response.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   //file name to dowanload/generate invoice
    //   saveAs(blob, filename);
    // });
  }

  /**
   * Requests via POST verb
   * @param endpointUrl
   * @param params
   * @param withHeader
   */
  post(endpointUrl: string, params: any, withHeader: boolean = false): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const headers = this._buildAuthHeaders();
    return this._http.post(url, JSON.stringify(params), { headers, observe: 'response' })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res: HttpResponse<any>) => {
          return (withHeader) ? res : res.body;
        })
      );
  }

  /**
   * Requests via PATCH verb
   * @param {string} endpointUrl
   * @param {*} params
   * @returns {Observable<any>}
   */
  patch(endpointUrl: string, params: any): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const headers = this._buildAuthHeaders();

    return this._http.patch(url, JSON.stringify(params), { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res: HttpResponse<any>) => res )
      );
  }

  /**
   * upload file
   * @param endpointUrl
   * @param formData
   */
  uploadFile(endpointUrl, formData): Observable<any> {

    const url = environment.apiEndpoint + endpointUrl;

    // Get Bearer Token from Auth Service
    const bearerToken = this._auth.getAccessToken();

    // Build Headers with Bearer Token
    // headers.append('Content-Type', 'multipart/form-data; charset=utf-8; boundary=' + Math.random().toString().substr(2));
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + bearerToken,
      Accept: 'application/json',
      enctype: 'multipart/form-data'
    });

    return this._http.post(url, formData, { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        map((res: HttpResponse<any>) => res)
      );
  }

  /**
   * Requests via DELETE verb. Params should be a part of the url string
   * similar to get requests.
   * @param {string} endpointUrl
   * @returns {Observable<any>}
   */
  delete(endpointUrl: string): Observable<any> {
    const url = environment.apiEndpoint + endpointUrl;
    const headers = this._buildAuthHeaders();

    return this._http.delete(url, { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res: HttpResponse<any>) => res)
      );
  }

  /**
   * Build the Auth Headers for All Verb Requests
   * @returns {Headers}
   */
  _buildAuthHeaders() {
    const bearerToken = this._auth.getAccessToken();
    // Build Headers with Bearer Token
    return new HttpHeaders({
      Authorization: 'Bearer ' + bearerToken,
      'Content-Type': 'application/json',
      Language: 'en',
      'Currency': this._auth.currency_pref
    });
  }

  /**
   * Handles Caught Errors from All Authorized Requests Made to Server
   * @returns {Observable}
   */
  private _handleError(error: any): Observable<any> {

    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // Handle Bad Requests
    // This error usually appears when agent attempts to handle an
    // account that he's been removed from assigning
    if (error.status === 400) {
      this.eventService.accountAssignmentRemoved$.next({});
      return EMPTY;
    }

    // Handle No Internet Connection Error

    if (error.status === 0 || error.status === 504) {
      // if(!navigator.onLine)
      this.eventService.internetOffline$.next({});
      return EMPTY;
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this._auth.logout('Session expired, please log back in.');
      return EMPTY;
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      console.error(error);
      this.eventService.error500$.next({});
      return EMPTY;
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      this.eventService.error404$.next({});
      return EMPTY;
    }

    console.error('Error: ' + errMsg);

    return throwError(errMsg);
  }
}
