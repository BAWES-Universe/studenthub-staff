import { Injectable, RendererFactory2 } from '@angular/core';
import {EMPTY, Observable, throwError} from 'rxjs';
import { catchError, first, map, retryWhen, take } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {genericRetryStrategy} from '../util/genericRetryStrategy';
import { Storage } from '@ionic/storage-angular';
// service
import {EventService} from './event.service';
import {environment} from '../../environments/environment';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { AnalyticsService } from './analytics.service';


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
  public role: number;
  public story: any;

  public navEnable = true;
  public currency_pref = 'USD';

  public isLogged = false;

  public displayCookieMessage = '0';

  public showOneSignalPrompt = false;

  private _urlBasicAuth = '/auth/login';
  private _urlUpdatePass = '/auth/update-password';
  private _urlResetPassRequest = '/auth/request-reset-password';
  public _urlLoginAuth0 = '/auth/login-auth0';
  public _urlUpdatePassword = '/auth/update-password';

  constructor(
    public storage: Storage,
    public _http: HttpClient,
    public auth: Auth0Service,
    public router: Router,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public eventService: EventService,
    public storageService: StorageService,
    public analyticService: AnalyticsService,
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

      if (route.data['navDisable']) {
        this.navEnable = false;
      }

      if (this.isLogged) {
        resolve(true);
      }

      this.storageService.get('loggedInStaff').then(user => {

        if (user) {
          this.isLogged = true;
          this._accessToken = user.token;
          this.staff_id = user.staff_id;
          this.email = user.email;
          this.name = user.name;
          this.theme = user.theme;
          this.role = user.role;
          this.story = user.story;

          resolve(true);
        } else {
          resolve(false);

          this.router.navigate(['login']);
          //this.logout('invalid access');
        }
      }).catch(r => {
        this.eventService.errorStorage$.next({});
      });
    });
  }

  /**
   * set app theme
   * @param theme
   */
  setTheme(theme) {
    this.storageService.set('theme', theme).catch(r => {
      this.eventService.errorStorage$.next({});
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
    this.storageService.set(
      'loggedInStaff',
      {
        token: this._accessToken,
        staff_id: this.staff_id,
        name: this.name,
        email: this.email,
        role: this.role,
        story: this.story
      }
    ).catch(r => {
      this.eventService.errorStorage$.next({});
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
    this.role = null;
    this.name = null;
    this.email = null;
    this.story = null;

    this.storageService.clear().catch(r => {
      this.eventService.errorStorage$.next({});
    });

    if (!silent) {
      this.eventService.userLoggedOut$.next(reason ? reason : false);
    }

    this.storageService.set('cookieMessageWasApproved',
     (this.displayCookieMessage == '0') ? '1' : '0'
    ).catch(r => {
      this.eventService.errorStorage$.next({});
    });
  }

  /**
   * Set the access token
   */
  setAccessToken(response, redirect = false) {

    this._accessToken = response.token;
    this.staff_id = response.staff_id;
    this.role = response.role;
    this.name = response.name;
    this.email = response.email;
    this.story = response.story;

    this.analyticService.user(this.staff_id, {
      name: this.name,
      email: this.email,
    });

    // Save to Storage
    this.saveInStorage();

    if (this._accessToken) {
      this.isLogged = true;
      this.eventService.userLogined$.next({ redirect });
    }
  }

  // This is the method you want to call at bootstrap
  load(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.storage.create().then(storage => {

        this.storageService._storage = storage;

        this.storageService.get('theme').then(ret => {

          if (ret) {
            this.setTheme(ret);
          }
        }).catch(r => {
          this.eventService.errorStorage$.next({});
        });

        this.storageService.get('loggedInStaff').then(staff => {

          if (staff && staff.token) {
            this.setAccessToken(staff);
          } else {
            // return this.logout('error with store variables',true);
          }
        }).catch(r => {
          this.eventService.errorStorage$.next({});
        });

        resolve(true);
      });
    });
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

    this.storageService.get('loggedInStaff').then(user => {

      if (user) {
        this.setAccessToken(user, redirect);
        this._accessToken = user.token;
      }
    }).catch(r => {
      this.eventService.errorStorage$.next({});
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
   * Login by Auth0 accessToken
   */
  async useTokenForAuth(accessToken, showLoader = true) {

    let loading;

    if (showLoader) {
      loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: 'Logging in...'
      });
      loading.present();
    }

    const url = environment.apiEndpoint + this._urlLoginAuth0;

    const headers = this._buildAuthHeaders();

    return this._http.post(url, {
      accessToken: accessToken,
    }, {
      headers: headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        if (response.operation == 'success') {

          this.setAccessToken(response, true);

        } else if (response.code == 1) {

          const alert = await this.alertCtrl.create({
            message: 'No account with login email', // JSON.stringify(err)
            buttons: ['Okay']
          });
          await alert.present();

          this.auth.logout({ returnTo: document.location.origin });

        } else if (response.operation == 'error') {

          const alert = await this.alertCtrl.create({
            message: 'Error getting login by Auth0 API', // JSON.stringify(err)
            buttons: ['Okay']
          });
          await alert.present();

        }

        //this.eventService.googleLoginFinished$.next({});

      }, err => {

        //this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  _buildAuthHeaders() {
    return new HttpHeaders({
      //Language: this.language_pref || 'en',
      'Content-Type': 'application/json'
    });
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
      this.eventService.accountAssignmentRemoved$.next({});
      return EMPTY;
    }

    // Handle No Internet Connection Error /service worker timeout

    if (error.status === 0 || error.status === 504) {
      this.eventService.internetOffline$.next({});
      return EMPTY;
    }

    if (!navigator.onLine) {
      this.eventService.internetOffline$.next({});
      return EMPTY;
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this.logout('Session expired, please log back in.');
      return EMPTY;
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      this.eventService.error500$.next({});
      return EMPTY;
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      this.eventService.error404$.next({});
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
