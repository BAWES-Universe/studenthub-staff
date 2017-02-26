import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Platform, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { ConfigService } from '../config.service';
import { AuthService } from '../auth.service';

/**
 * Handles all Authorized HTTP functions with Bearer Token
 */
@Injectable()
export class AuthHttpService {

  constructor(
    private _http: Http,
    private _auth: AuthService,
    private _config: ConfigService,
    private _platform: Platform,
    private _events: Events
    ) {}

  /**
   * Requests via GET verb
   * @param {string} endpointUrl
   * @returns {Observable<any>}
   */
  get(endpointUrl: string): Observable<any>{
    const url = this._config.apiBaseUrl + endpointUrl;

    return this._http.get(url, {headers: this._buildAuthHeaders()})
              .catch((err) => this._handleError(err))
              .take(1)
              .map((res: Response) => res.json());
  }

  /**
   * Requests via POST verb
   * @param {string} endpointUrl
   * @param {*} params
   * @returns {Observable<any>}
   */
  post(endpointUrl: string, params: any): Observable<any>{
    const url = this._config.apiBaseUrl + endpointUrl;

    return this._http.post(url, JSON.stringify(params), {headers: this._buildAuthHeaders()})
              .catch((err) => this._handleError(err))
              .take(1)
              .map((res: Response) => res.json());
  }

  /**
   * Requests via PATCH verb
   * @param {string} endpointUrl
   * @param {*} params
   * @returns {Observable<any>}
   */
  patch(endpointUrl: string, params: any): Observable<any>{
    const url = this._config.apiBaseUrl + endpointUrl;

    return this._http.patch(url, JSON.stringify(params), {headers: this._buildAuthHeaders()})
              .catch((err) => this._handleError(err))
              .take(1)
              .map((res: Response) => res.json());
  }

  /**
   * Requests via DELETE verb. Params should be a part of the url string 
   * similar to get requests.
   * @param {string} endpointUrl
   * @returns {Observable<any>}
   */
  delete(endpointUrl: string): Observable<any>{
    const url = this._config.apiBaseUrl + endpointUrl;

    return this._http.delete(url, {headers: this._buildAuthHeaders()})
              .catch((err) => this._handleError(err))
              .take(1)
              .map((res: Response) => res.json());
  }

  /**
   * Build the Auth Headers for All Verb Requests
   * @returns {Headers}
   */
  private _buildAuthHeaders(){
    // Get Bearer Token from Auth Service
    const bearerToken = this._auth.getAccessToken();

    // Build Headers with Bearer Token
    const headers = new Headers();
    headers.append("Authorization", "Bearer "+ bearerToken);
    headers.append("Content-Type", "application/json");

    return headers;
  }


  /**
   * Handles Caught Errors from All Authorized Requests Made to Server
   * @returns {Observable} 
   */
  private _handleError(error: any): Observable<any> {
      let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';

      // Handle Bad Requests
      // This error usually appears when agent attempts to handle an 
      // account that he's been removed from assigning
      if (error.status === 400) {
          this._events.publish("accountAssignment:removed");
          return Observable.empty<Response>();
      }

      // Handle No Internet Connection Error
      if (error.status == 0) {
          this._events.publish("internet:offline");
          //this._auth.logout("Unable to connect to Plugn servers. Please check your internet connection.");
          return Observable.empty<Response>();
      }

      // Handle Expired Session Error
      if (error.status === 401) {
          this._auth.logout('Session expired, please log back in.');
          return Observable.empty<Response>();
      }

      alert("Error: "+errMsg);

      return Observable.throw(errMsg);
  }

}
