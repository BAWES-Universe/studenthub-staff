import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let ChangePasswordPage = class ChangePasswordPage {
    constructor(_toastCtrl, _alertCtrl, _fb, accountService, authService) {
        this._toastCtrl = _toastCtrl;
        this._alertCtrl = _alertCtrl;
        this._fb = _fb;
        this.accountService = accountService;
        this.authService = authService;
        this.loading = false;
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
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.accountService.updatePassword(this.form.value).subscribe((result) => __awaiter(this, void 0, void 0, function* () {
                if (result.operation == 'success') {
                    const toast = yield this._toastCtrl.create({
                        message: result.message,
                        duration: 3000
                    });
                    toast.present();
                    this.authService.logout();
                }
                else {
                    const prompt = yield this._alertCtrl.create({
                        message: result.message,
                        buttons: ['Ok']
                    });
                    prompt.present();
                }
            }), (err) => __awaiter(this, void 0, void 0, function* () {
                const prompt = yield this._alertCtrl.create({
                    message: err,
                    buttons: ['Okay']
                });
                prompt.present();
            }), () => {
                this.loading = false;
            });
        });
    }
};
ChangePasswordPage = __decorate([
    Component({
        selector: 'app-change-password',
        templateUrl: './change-password.page.html',
        styleUrls: ['./change-password.page.scss'],
    })
], ChangePasswordPage);
export { ChangePasswordPage };
//# sourceMappingURL=change-password.page.js.map