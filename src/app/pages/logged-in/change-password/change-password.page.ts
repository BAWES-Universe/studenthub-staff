import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public form: FormGroup;

  public oldType: string = 'password';

  public type: string = 'password';

  public loading = false;

  public borderLimit = false;

  constructor(
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _fb: FormBuilder,
    public accountService: AccountService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  /**
   * Save new password
   */
  async save() {
    this.loading = true;

    this.accountService.updatePassword(this.form.value).subscribe(async result => {

      if (result.operation == 'success') {
        const toast = await this._toastCtrl.create({
          message: result.message,
          duration: 3000
        });
        toast.present();
        this.authService.logout();
      } else {
        const prompt = await this._alertCtrl.create({
          message: result.message,
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

  toggleOldPasswordVisibility() {
    this.oldType = this.oldType == 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
