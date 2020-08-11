import { Component, OnInit } from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {AuthService} from 'src/app/providers/auth.service';
import {AccountService} from 'src/app/providers/logged-in/account.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public form: FormGroup;
  public loading = false;

  constructor(
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _fb: FormBuilder,
    public accountService: AccountService,
    public authService: AuthService,
  ) {
    this.form = this._fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
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
        buttons: ['Ok']
      });
      prompt.present(); 
    }, () => {
      this.loading = false;
    });
  }
}
