import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { Platform, Events, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConfigService } from './config.service';

/*
  Handles all Auth functions
*/
@Injectable()
export class AuthService {

  // Logged in agent details
  private _accessToken;
  public id: number;
  public name: string;
  public email: string;

  private _urlBasicAuth: string = "/auth/login";

  constructor(
    private _http: Http,
    private _platform: Platform,
    private _config: ConfigService,
    private _storage: Storage,
    private _events: Events,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController
    ) { }

  /**
   * Logs a user out by setting logged in to false and clearing token from storage
   * @param {string} [reason]
   */
  logout(reason?: string){
    // Remove from Storage then process logout
    this._accessToken = null;
    this._storage.clear().then(() => {
       this._events.publish('user:logout', reason?reason:false);
    });
  }

  /**
   * Set the access token
   */
  setAccessToken(token: string, id: number, name: string, email: string){
    this._accessToken = token;
    this.id = id;
    this.name = name;
    this.email = email;

    // Save to Storage 
    this._storage.set('bearer', token);
    this._storage.set('id', id);
    this._storage.set('name', name);
    this._storage.set('email', email);

    // Log User In by Triggering Event that Access Token has been Set
    this._events.publish('user:login', 'TokenSet');
  }

  /**
   * Get Access Token from Service or LocalStorage
   * @returns {string} token
   */
  getAccessToken(){
    // Return Access Token if set already
    if(this._accessToken){
      return this._accessToken;
    }

    // Check Storage and Try Again
    const p1 = this._storage.get('bearer');
    const p2 = this._storage.get('id');
    const p3 = this._storage.get('name');
    const p4 = this._storage.get('email');
    Promise.all([p1, p2, p3, p4]).then(results => {
      if(results[0] && results[1] && results[2] && results[3]){
        this.setAccessToken(results[0], results[1], results[2], results[3]);
        return this.getAccessToken();
      }else{
        this.logout();
      }
    }, () => {
      // On Promise Failure
      this.logout();
    });

    // No Access Token Available
    return false;
  }

  /**
   * Basic auth, exchanges access details for a bearer access token to use in
   * subsequent requests.
   * @param  {string} email
   * @param  {string} password
   */
  basicAuth(email: string, password: string): Observable<any>{
    // Add Basic Auth Header with Base64 encoded email and password
    const authHeader = new Headers();
    authHeader.append("Authorization", "Basic "+ btoa(`${email}:${password}`));

    const url = this._config.apiBaseUrl+this._urlBasicAuth;

    return this._http.get(url, {
        headers: authHeader
      })
      .first()
      .map((res: Response) => res.json());
  }

  /**
   * Change password by password reset token
   * @param token 
   * @param newPassword 
   */
  changePassword(token: string, newPassword: string): Observable<any>{
    
    const url = this._config.apiBaseUrl + '/auth/update-password';

    return this._http.patch(url, {
        token: token, 
        newPassword: newPassword
      })
      .first()
      .map((res: Response) => res.json());
  }
}
