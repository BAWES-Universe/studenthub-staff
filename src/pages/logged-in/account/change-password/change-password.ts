import { Component } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Service
import { AccountService } from '../../../../providers/logged-in/account.service';
import { AuthService } from '../../../../providers/auth.service';

@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html'
})
export class ChangePasswordPage {

    public form: FormGroup;

    constructor(
        private _loadingCtrl: LoadingController,
        private _toastCtrl: ToastController,
        private _alertCtrl: AlertController,
        private _fb: FormBuilder,
        public accountService: AccountService,
        public authService: AuthService,
    ) { 
        this.form = this._fb.group({
            password: ["", Validators.required],
            newPassword: ["", Validators.required]
        });
    }

    /**
     * Save new password
     */
    save() {
        let loader = this._loadingCtrl.create();
        loader.present();

        this.accountService.updatePassword(this.form.value).subscribe(result => {
            if(result.operation == 'success') 
            {
                let toast = this._toastCtrl.create({
                    message: result.message,
                    duration: 3000
                });
                toast.present();
                this.authService.logout();
            } else {
                let prompt = this._alertCtrl.create({
                    message: result.message,
                    buttons: ["Ok"]
                });
                prompt.present();
            }
        }, (err) => { 
            console.log(err);
        }, () => {
            loader.dismiss();
        }); 
    }
}