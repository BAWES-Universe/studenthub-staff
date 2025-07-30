import { Injectable, RendererFactory2 } from '@angular/core';
import {EMPTY, Observable, throwError} from 'rxjs';
import { catchError, first, map, retryWhen, take } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {genericRetryStrategy} from '../util/genericRetryStrategy';
import { Storage } from '@ionic/storage-angular';
//import "@codetrix-studio/capacitor-google-auth";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// service
import {EventService} from './event.service';
import {environment} from '../../environments/environment';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { PermissionService } from './permission.service';
//import { AnalyticsService } from './analytics.service';
import { TranslateLabelService } from './translate-label.service';
import { Permission } from '../models/permission';
import { UserPermission } from '../models/user-permission';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public renderer;

  private _accessToken;
  private _urlPermission = '/permission-section/user-permission/staff';
  public staff_id: number;
  public name: string;
  public email: string;
  public theme: string = "day";
  public role: number;
  public story: any;

  public navEnable = true;
  public currency_pref = 'KWD';

  public currencies = [];

  public isLogged = false;

  public displayCookieMessage = '0';

  public showOneSignalPrompt = false;

  private _urlBasicAuth = '/auth/login';
  private _urlUpdatePass = '/auth/update-password';
  private _urlResetPassRequest = '/auth/request-reset-password';
  public _urlLoginAuth0 = '/auth/login-auth0';
  public _urlUpdatePassword = '/auth/update-password';
  public _urlLoginByGoogle = '/auth/login-by-google';
  public _urlLoginByKey = '/auth/login-by-key';
  private _urlTwoStep = '/auth/login-two-step';

  constructor(
    public storage: Storage,
    public _http: HttpClient,
    public auth: Auth0Service,
    public router: Router,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public eventService: EventService,
    public translate: TranslateLabelService,
    public storageService: StorageService,
    private permissionService: PermissionService,
    //public analyticService: AnalyticsService,
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
          this.role = user.role;
          this.story = user.story;

          //if (user.theme)
          //  this.theme = user.theme;

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

    this.theme = theme;

    if (theme == 'night') {
      this.renderer.removeClass(document.body, 'day');
      this.renderer.addClass(document.body, 'night');
    } else {
      this.renderer.addClass(document.body, 'day');
      this.renderer.removeClass(document.body, 'night');
    }

    this.storageService.set('theme', theme).catch(r => {
      this.eventService.errorStorage$.next({});
    });
  }

  /**
   * Save user data in storage
   */
  saveInStorage() {

    this.storageService.set('currency_pref', this.currency_pref);

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

    this.storageService.set('theme', this.theme);

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

    // Save to Storage
    this.saveInStorage();

    if (this._accessToken) {
      this.isLogged = true;
      // Use PermissionService directly to load permissions
      this.permissionService.loadPermissions(this.staff_id, this._accessToken).subscribe({
        next: () => {
          // Permissions loaded successfully
          this.eventService.userLogined$.next({ redirect });
        },
        error: (error) => {
          console.error('Error loading permissions:', error);
          this.eventService.userLogined$.next({ redirect });
        }
      });
    }
  }

  // This is the method you want to call at bootstrap
  load(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.storage.create().then(storage => {

        this.storageService._storage = storage;

        this.storageService.get('currency_pref').then(ret => {

          if (ret) {
            this.currency_pref = ret;
          } else {
            this.currency_pref = "KWD";//default
          }
        }).catch(r => {
          console.info(r);
          //this.eventService.errorStorage$.next({});
        });

        /*this.storageService.get('theme').then(ret => {

          if (ret) {
            this.setTheme(ret);
          }
        }).catch(r => {
          console.error(r);
          this.eventService.errorStorage$.next({});
        });*/

        this.storageService.get('loggedInStaff').then(staff => {

          if (staff && staff.token) {
            this.setAccessToken(staff);
          } else {
            // return this.logout('error with store variables',true);
          }
        }).catch(r => {
          console.error(r);
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
   * @param  {string} token
   */
  basicAuth(email: string, password: string, token: string): Observable<any> {
    // Add Basic Auth Header with Base64 encoded email and password
    const authHeader = new HttpHeaders({
      Authorization: 'Basic ' + btoa(unescape(encodeURIComponent(`${email}:${password}`))),
      Currency: this.currency_pref,
      'g-recaptcha-response': token
    });
    const url = environment.apiEndpoint + this._urlBasicAuth;// + '?token=' + token;
    return this._http.get(url, {
      headers: authHeader,
    }).pipe(
      retryWhen(genericRetryStrategy()),
      first(),
      map((res: HttpResponse<any>) => res)
    );
  }


  loginTwoStep(grecaptchaToken: string, token: string, otp: string): Observable<any> {

    const authHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      "Currency": this.currency_pref || "KWD",
      'g-recaptcha-response': grecaptchaToken
    });

    const url = environment.apiEndpoint + this._urlTwoStep;

    return this._http.post(url, {
      token: token,
      otp: otp
    }, {
      headers: authHeader
    });/*
      .pipe(
        take(1),
        // map((res: Response) => res)
      );*/
  }

  /**
   * show login error message
   * @param message
   */
  async showLoginError(message = null) {
    const alert = await this.alertCtrl.create({
      message: message? message: this.translate.transform('Error getting login'),
      buttons: [this.translate.transform('Okay')]
    });
    await alert.present();
  }

  /**
   * Login by Google for mobile app
   */
  loginByGoogle() {

    GoogleAuth.signIn().then(async googleUser => {

      if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
        this.useGoogleIdTokenForAuth(googleUser.authentication.idToken, false);
      } else {
        this.eventService.googleLoginFinished$.next({});

        this.showLoginError('Error getting login by Google+ API');
      }
    }).catch(async err => {

      console.error(err);

      this.eventService.googleLoginFinished$.next({});

      if (err = 'popup_closed_by_user') {
        return false;
      }

      this.showLoginError('Error getting login by Google+ API');
    });
  }

  async loginByKey(auth_key: string) {

    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: this.translate.transform('Logging in...')
    });
    loading.present();

    const url = environment.apiEndpoint + this._urlLoginByKey;

    const headers = this._buildAuthHeaders();

    return this._http.post(url, {
      auth_key: auth_key
    }, {
      headers
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

        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.translate.transform('Error getting login'), // JSON.stringify(err)
            buttons: [this.translate.transform('Okay')]
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

  /**
   * Login by google idToken
   */
  async useGoogleIdTokenForAuth(idToken, showLoader = true) {

    let loading;

    if (showLoader) {
      loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: this.translate.transform('Logging in...')
      });
      loading.present();
    }

    const url = environment.apiEndpoint + this._urlLoginByGoogle;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang || "en"
    });

    return this._http.post(url, {
      idToken: idToken,
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

          this.handleLogin(response, 'Google');

        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.translate.transform('Error getting login by Google+ API'), // JSON.stringify(err)
            buttons: [this.translate.transform('Ok')]
          });
          await alert.present();

        }

        this.eventService.googleLoginFinished$.next({});

      }, err => {

        this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  /**
   * Handle response from api call to get login/register by google token or otp
   * @param response
   */
  handleLogin(response, channel) {

    if (response.operation === 'success') {

      /*this.analyticsService.track("Log In", {
        login_method: channel
      })*/

      this.setAccessToken(response, true);

    } else {

      this.alertCtrl.create({
        message: response.message,
        buttons: [this.translate.transform('Okay')]
      }).then(alert => {
        alert.present();
      });
    }
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
      'Content-Type': 'application/json',
      'Currency': this.currency_pref
    });
  }

  isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  /**
   * json to string error message
   * @param message
   */
  errorMessage(message): string {

    if (this.isString(message)) {
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
      'Currency': this.currency_pref
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
    const headers = new HttpHeaders({
      Currency: this.currency_pref,
      'Content-Type': 'application/json'
    });
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
      console.error(error);
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

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1:
        return 'opera';
      case agent.indexOf('chrome') > -1:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
}
