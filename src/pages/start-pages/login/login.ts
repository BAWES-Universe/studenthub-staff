// Core
import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

// Services
import { AuthService } from '../../../providers/auth.service';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../validators/custom.validator';

/**
 * Login Page 
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  // Store old email and password to make sure user won't make same mistake twice
  public oldEmailInput = "";
  public oldPasswordInput = "";

  // Store number of invalid password attempts to suggest reset password
  private _numberOfLoginAttempts = 0;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _alertCtrl: AlertController
    ){
      // Initialize the Login Form
      this.loginForm = this._fb.group({
        email: ["", [Validators.required, CustomValidator.emailValidator]],
        password: ["", Validators.required]
      });
  }

  /**
   * Attempts to login with the provided email and password
   */
  onSubmit(){
    this.isLoading = true;

    const email = this.oldEmailInput = this.loginForm.value.email;
    const password = this.oldPasswordInput = this.loginForm.value.password;


    this._auth.basicAuth(email, password).subscribe(res => {
      this.isLoading = false;

      if(res.operation == "success"){
        // Successfully logged in, set the access token within AuthService
        this._auth.setAccessToken(res.token, res.id, res.name, res.email);
      }else if(res.operation == "error"){
        let alert = this._alertCtrl.create({
          title: 'Unable to Log In',
          message: res.message,
          buttons: ['Ok'],
        });
        alert.present();
      }

    }, err => {
      this.isLoading = false;

      // Incorrect email or password
      if(err.status == 401){
        this._numberOfLoginAttempts++;

        // Check how many login attempts this user made, offer to reset password
        if(this._numberOfLoginAttempts > 2){
          let alert = this._alertCtrl.create({
            title: 'Trouble Logging In?',
            message: "If you've forgotten your password, contact us to have it reset.",
            buttons: ['Ok'],
          });
          alert.present();
        }
        else{
          let alert = this._alertCtrl.create({
            title: 'Invalid email or password',
            message: 'The information entered is incorrect. Please try again.',
            buttons: ['Try Again'],
          });
          alert.present();
        }
      }else{
        /**
         * Error not accounted for. Show Message
         */
        let alert = this._alertCtrl.create({
            title: 'Unable to Log In',
            message: "There seems to be an issue connecting to Payroll servers. Please contact us if the issue persists.",
            buttons: ['Ok'],
          });
          alert.present();
      }
    });
  }


}
