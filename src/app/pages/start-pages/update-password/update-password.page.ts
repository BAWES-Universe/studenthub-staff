import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, AlertController, IonInput, ModalController } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  public type: string = 'password';

  public token;

  public newPassword = '';

  public passwordForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  @ViewChild('inptPassword', { static: false }) inptPassword: IonInput;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public translateService: TranslateLabelService,
    public analyticsService: AnalyticsService,
    public authService: AuthService,
    private _alertCtrl: AlertController
  ) {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }

  ngOnInit() {
    this.analyticsService.page('Update Password Page');

    // Initialize the Login Form
    this.passwordForm = this._fb.group({
      newPassword: ['', Validators.required]
    });

    setTimeout(() => {
      if(this.inptPassword)
        this.inptPassword.setFocus();
    }, 800);
  }

  /**
   * close page
   */
  dismiss() {
    // this.modalCtrl.dismiss();
    this.navCtrl.navigateRoot('/');
  }

  /**
   * Attempts to login with the provided email and password
   */
  async save() {

    if (!this.passwordForm.valid) {
      return false;
    }

    this.isLoading = true;

    this.authService.changePassword(this.passwordForm.value.newPassword, this.token).subscribe(async res => {

      this.isLoading = false;

      if (res.operation == 'success') {

        const alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

        this.passwordForm.reset();

        this.dismiss();

      } else if (res.operation == 'error') {

        const alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    }, () => {
      this.isLoading = false;
    });
  }

  showPassword() {
    this.type = this.type == 'password'? 'text': 'password';
  }
}
