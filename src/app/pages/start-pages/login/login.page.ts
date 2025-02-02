import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, Platform} from '@ionic/angular';
import {AuthService} from '../../../providers/auth.service';
import {CustomValidator} from '../../../validators/custom.validator';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventService } from 'src/app/providers/event.service';
import { Router } from '@angular/router';

declare let grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  // Store old email and password to make sure user won't make same mistake twice
  public oldEmailInput = '';
  public oldPasswordInput = '';

  // Store number of invalid password attempts to suggest reset password
  private _numberOfLoginAttempts = 0;

  public type: string = 'password';

  public loading: boolean = false; 

  constructor(
    private _fb: FormBuilder,
    public platform: Platform,
    public router: Router,
    public auth0: Auth0Service,
    public _auth: AuthService,
    public eventService: EventService,
    public analyticService: AnalyticsService,
    private _alertCtrl: AlertController
  ){
  }

  ngOnInit() {

    this.analyticService.page('Login Page');
    
    // Initialize the Login Form
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      password: ['', Validators.required],
      currency_code: [this._auth.currency_pref || "KWD", Validators.required],
    });
    
    this.eventService.googleLoginFinished$.subscribe(() => {
      this.loading = false;
    });
  }

  /**
   * Attempts to login with the provided email and password
   */
  onSubmit() {

    grecaptcha.ready(() => {
      grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token: string) => {
        this.onValidCaptcha(token);
      });
    });
  }

  onValidCaptcha(token: string) {
    this.isLoading = true;

    const email = this.oldEmailInput = this.loginForm.value.email;
    const password = this.oldPasswordInput = this.loginForm.value.password;

    this._auth.currency_pref = this.loginForm.value.currency_code;
    
    this._auth.basicAuth(email, password, token).subscribe(async res => {
      
      this.isLoading = false;

      if (res.operation == 'success'){
        // Successfully logged in, set the access token within AuthService
         
        if (res.token_status == 0) {
          this.router.navigateByUrl('/login-two-step/' + res.token);
        } else {
          this._auth.setAccessToken(res, true);
        }
      }else if (res.operation == 'error'){
        const alert = await this._alertCtrl.create({
          header: 'Unable to Log In',
          message: this._auth.errorMessage(res.message),
          buttons: ['Ok'],
        });
        alert.present();
      }

    }, async err => {
      this.isLoading = false;

      // Incorrect email or password
      if (err.status == 401){
        this._numberOfLoginAttempts++;

        // Check how many login attempts this user made, offer to reset password
        if (this._numberOfLoginAttempts > 2){
          const alert = await this._alertCtrl.create({
            header: 'Trouble Logging In?',
            message: 'If you\'ve forgotten your password, contact us to have it reset.',
            buttons: ['Ok'],
          });
          alert.present();
        }
        else{
          const alert = await this._alertCtrl.create({
            header: 'Invalid email or password',
            message: 'The information entered is incorrect. Please try again.',
            buttons: ['Try Again'],
          });
          alert.present();
        }
      }else{
        /**
         * Error not accounted for. Show Message
         */
        const alert = await this._alertCtrl.create({
          header: 'Unable to Log In',
          message: 'There seems to be an issue connecting to Payroll servers. Please contact us if the issue persists.',
          buttons: ['Ok'],
        });
        alert.present();
      }
    });
  }

  /**
   * login by google on capacitor app 
   */
  loginByGoogle() {
    this.loading = true; 

    this._auth.loginByGoogle();
  } 

  /**
   * redirec to auth0
   */
  loginWithRedirect() {
    const url = this.platform.is('hybrid') ? `co.studenthub.staff://view/tasks`: document.location.origin;
    this.auth0.loginWithRedirect({ redirect_uri: url })
  }

  togglePasswordVisibility() {
    this.type = this.type == 'password'? 'text': 'password';
  }

  onCurrencyChange(event) {
    this._auth.currency_pref = event;
    this._auth.saveInStorage();
  }
}
