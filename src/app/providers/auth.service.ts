import { Injectable, RendererFactory2 } from '@angular/core';
import {EMPTY, Observable, throwError} from 'rxjs';
import { catchError, first, map, retryWhen, take } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {genericRetryStrategy} from '../util/genericRetryStrategy';

// service
import {EventService} from './event.service';
import {environment} from '../../environments/environment';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public renderer;

  private _accessToken;
  public staff_id: number;
  public name: string;
  public email: string;
  public theme: string;
  public navEnable = true;
  public currency_pref = 'USD';

  public isLogged = false;

  public displayCookieMessage = '0';

  public showOneSignalPrompt = false;

  private _urlBasicAuth = '/auth/login';
  private _urlUpdatePass = '/auth/update-password';
  private _urlResetPassRequest = '/auth/request-reset-password';

  constructor(
    public _http: HttpClient,
    public router: Router,
    public eventService: EventService,
    public rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    /**
     * new router changes don't wait for startup service
     * https://github.com/angular/angular/issues/14615
     */
    return new Promise(async resolve => {

      this.navEnable = true;

      if (route.data.navDisable) {
        this.navEnable = false;
      }

      if (this.isLogged) {
        resolve(true);
      }

      const ret = await Storage.get({ key: 'loggedInStaff' });

      const user = JSON.parse(ret.value);

      if (user) {
        this.isLogged = true;
        this._accessToken = user.token;
        this.staff_id = user.staff_id;
        this.email = user.email;
        this.name = user.name;
        this.theme = user.theme;

        resolve(true);
      } else {
        resolve(false);
        this.logout('invalid access');
      }

    });
  }

  /**
   * set app theme
   * @param theme
   */
  setTheme(theme) {
    Storage.set({
      key: 'theme',
      value: theme
    });

    this.theme = theme;

    if (theme == 'night') {
      this.renderer.removeClass(document.body, 'day');
      this.renderer.addClass(document.body, 'night');
    } else {
      this.renderer.addClass(document.body, 'day');
      this.renderer.removeClass(document.body, 'night');
    }
  }

  /**
   * Save user data in storage
   */
  saveInStorage() {
    Storage.set({
      key: 'loggedInStaff',
      value: JSON.stringify({
        token: this._accessToken,
        staff_id: this.staff_id,
        name: this.name,
        email: this.email
      })
    });
  }

  /**
   * Logs a user out by setting logged in to false and clearing token from storage
   * @param {string} [reason]
   * @param {boolean} [silent]
   */
  logout(reason?: string, silent = false) {

    this.isLogged = false;

    // Remove from Storage then process logout

    this._accessToken = null;
    this.staff_id = null;
    this.name = null;
    this.email = null;
    Storage.clear();

    if (!silent) {
      this.eventService.userLoggedOut$.next(reason ? reason : false);
    }

    Storage.set({
      key: 'cookieMessageWasApproved',
      value : (this.displayCookieMessage == '0') ? '1' : '0'
    });
  }

  /**
   * Set the access token
   */
  setAccessToken(response, redirect = false) {

    this._accessToken = response.token;
    this.staff_id = response.staff_id;
    this.name = response.name;
    this.email = response.email;

    // Save to Storage
    this.saveInStorage();

    if (this._accessToken) {
      this.isLogged = true;
      this.eventService.userLogined$.next({ redirect });
    }
  }

  // This is the method you want to call at bootstrap
  async load(): Promise<any> {
    const ret = await Storage.get({ key: 'loggedInStaff' });

    const staff = JSON.parse(ret.value);

    if (staff && staff.token) {
      return this.setAccessToken(staff);
    } else {
      // return this.logout('error with store variables',true);
    }

    const { value } = await Storage.get({ key: 'theme' });

    if (value) {
      this.setTheme(value);
    }
  }

  /**
   * Get Access Token from Service or Cookie
   * @returns {string} token
   */
  getAccessToken(redirect = false) {

    // Return Access Token if set already
    if (this._accessToken) {
      return this._accessToken;
    }

    Storage.get({ key: 'loggedInStaff' }).then(ret => {
      const user = JSON.parse(ret.value);

      if (user) {
        this.setAccessToken(user, redirect);
        this._accessToken = user.token;
      }
    });

    return this._accessToken;
  }

  /**
   * Basic auth, exchanges access details for a bearer access token to use in
   * subsequent requests.
   * @param  {string} email
   * @param  {string} password
   */
  basicAuth(email: string, password: string): Observable<any> {
    // Add Basic Auth Header with Base64 encoded email and password
    const authHeader = new HttpHeaders({
      Authorization: 'Basic ' + btoa(unescape(encodeURIComponent(`${email}:${password}`)))
    });
    const url = environment.apiEndpoint + this._urlBasicAuth;
    return this._http.get(url, {
      headers: authHeader,
    }).pipe(
      retryWhen(genericRetryStrategy()),
      first(),
      map((res: HttpResponse<any>) => res)
    );
  }

  /**
   * json to string error message
   * @param message
   */
  errorMessage(message): string {

    if (message.length) {
      return message + '';
    }

    const a = [];

    for (const i in message) {

      if (!Array.isArray(message[i])) {
        a.push(message[i]);
        continue;
      }

      for (const j of message[i]) {
        a.push(j);
      }
    }

    return a.join('<br />');
  }

  /**
   * reset password request
   * @param email
   */
  resetPasswordRequest(email: string) {
    const url = environment.apiEndpoint + this._urlResetPassRequest;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(url, { email }, { headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }
  /**
   * Change password by password reset token
   * @param token
   * @param newPassword
   */
  changePassword(newPassword: string, token: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this._http.patch(environment.apiEndpoint + this._urlUpdatePass, {
      newPassword,
      token
    }, {headers}).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
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
      this.eventService.accountAssignmentRemoved$.next();
      return EMPTY;
    }

    // Handle No Internet Connection Error /service worker timeout

    if (error.status === 0 || error.status === 504) {
      this.eventService.internetOffline$.next();
      return EMPTY;
    }

    if (!navigator.onLine) {
      this.eventService.internetOffline$.next();
      return EMPTY;
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this.logout('Session expired, please log back in.');
      return EMPTY;
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      this.eventService.error500$.next();
      return EMPTY;
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      this.eventService.error404$.next();
      return EMPTY;
    }
    console.log('Error: ' + errMsg);

    return throwError(errMsg);
  }

  _processResponseMessage(response) {
    let html = '';
    for (const i in response.message) {
        for (const j of response.message[i]) {
          html += j + '<br />';
        }
      }

    return html;
  }
}
