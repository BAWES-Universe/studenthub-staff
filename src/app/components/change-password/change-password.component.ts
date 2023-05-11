import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  public loading: boolean = false;
  public validatingPassword: boolean = false;

  public form: FormGroup;

  public type: string = 'password';

  public confirmType: string = 'password';

  constructor(
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private _fb: FormBuilder,
    public accountService: AccountService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.form = this._fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmType = this.confirmType == 'password' ? 'text' : 'password';
  }

  /**
   * submit new password
   */
  submit() {

    this.loading = true;

    this.accountService.updatePassword(this.form.value).subscribe(async result => {

      if (result.operation == 'success') {
        const toast = await this._toastCtrl.create({
          message: this.authService.errorMessage(result.message),
          duration: 3000
        });
        toast.present();
        this.modalCtrl.dismiss();

      } else {
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(result.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, async (err) => {

      const prompt = await this._alertCtrl.create({
        message: err,
        buttons: ['Okay']
      });
      prompt.present();
    }, () => {
      this.loading = false;
    });
  }


  close(refresh = false) {
    const data = { refresh };
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss(data);
      }
    });
  }

  /**
   * validate password on type
   * @param $event
   */
  async validateOldPassword($event) {
    $event.stopPropagation();
    this.validatingPassword = true;
    this.accountService.validatePassword(this.form.value).subscribe(async result => {
      this.validatingPassword = false;
      this.form.controls['password'].setErrors(null);
      if (!result) {
          this.form.controls['password'].setErrors({'incorrect': true});
      }
    }, async (err) => {

      const prompt = await this._alertCtrl.create({
        message: err,
        buttons: ['Okay']
      });
      prompt.present();
    }, () => {
      this.loading = false;
    });
  }
}
