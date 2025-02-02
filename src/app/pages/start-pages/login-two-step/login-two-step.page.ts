import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


declare let grecaptcha: any;

@Component({
  selector: 'app-login-two-step',
  templateUrl: './login-two-step.page.html',
  styleUrls: ['./login-two-step.page.scss'],
})
export class LoginTwoStepPage implements OnInit {

  public form: FormGroup;

  public isLoading = false;

  private numberOfLoginAttempts = 0;

  constructor(
    private fb: FormBuilder,
    public translateService: TranslateLabelService,
    private eventService: EventService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private alertCtrl: AlertController,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Login Two Step Page');
     
    const token = this.activatedRoute.snapshot.params['token'];

    this.form = this.fb.group({
      token: [token, Validators.required],
      otp: ['', Validators.required],
    });
  }

  async onSubmit() {
    grecaptcha.ready(() => {
      grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token: string) => {
        this.onValidCaptcha(token);
      });
    });
  }

  /**
   * change app language 
   * @param event 
  
  changeLanguage(event) {
    const lang = this.translateService.currentLang == 'ar' ? 'en' : 'ar';
    this.eventService.setLanguagePref$.next(lang);
  } */

  async onValidCaptcha(grecaptchaToken: string) {
    
    this.isLoading = true;

    this.authService.loginTwoStep(grecaptchaToken, this.form.value.token, this.form.value.otp).subscribe(async res => {
      this.isLoading = false;

      if (res.operation == 'success') {
        // Successfully logged in, set the access token within AuthService
        this.authService.setAccessToken(res, true);
      } else if (res.operation == 'error') {
        const alert = await this.alertCtrl.create({
          header: 'Unable to Log In',
          message: res.message,
          buttons: ['Ok'],
        });
        alert.present();
      }
    }, async err => {

      this.isLoading = false;

      // Incorrect email or password
      if (err.status == 401) {
        this.numberOfLoginAttempts++;

        // Check how many login attempts this user made, offer to reset password
        if (this.numberOfLoginAttempts > 2) {
          const alert = await this.alertCtrl.create({
            header: 'Trouble Logging In?',
            message: 'If you\'ve forgotten your password, contact us to have it reset.',
            buttons: ['Ok'],
          });
          alert.present();
        }
        else {
          const alert = await this.alertCtrl.create({
            header: 'Invalid email or password',
            message: 'The information entered is incorrect. Please try again.',
            buttons: ['Try Again'],
          });
          alert.present();
        }
      } else {
        /**
         * Error not accounted for. Show Message
         */
        const alert = await this.alertCtrl.create({
          header: 'Unable to Log In',
          message: 'There seems to be an issue connecting to Payroll servers. Please contact us if the issue persists.',
          buttons: ['Ok'],
        });
        alert.present();
      }
    });
  }
}
