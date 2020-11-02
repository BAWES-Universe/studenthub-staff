import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../../../providers/auth.service';
import {CustomValidator} from '../../../validators/custom.validator';

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

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _alertCtrl: AlertController
  ){
    // Initialize the Login Form
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  /**
   * Attempts to login with the provided email and password
   */
  onSubmit() {
    this.isLoading = true;

    const email = this.oldEmailInput = this.loginForm.value.email;
    const password = this.oldPasswordInput = this.loginForm.value.password;

    this._auth.basicAuth(email, password).subscribe(async res => {
      this.isLoading = false;

      if (res.operation == 'success'){
        // Successfully logged in, set the access token within AuthService
        this._auth.setAccessToken(res);
      }else if (res.operation == 'error'){
        const alert = await this._alertCtrl.create({
          header: 'Unable to Log In',
          message: res.message,
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

  togglePasswordVisibility() {
    this.type = this.type == 'password'? 'text': 'password';
  }
}
