import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidator } from '../../../validators/custom.validator';
let LoginPage = class LoginPage {
    constructor(_fb, _auth, _alertCtrl) {
        this._fb = _fb;
        this._auth = _auth;
        this._alertCtrl = _alertCtrl;
        // Disable submit button if loading response
        this.isLoading = false;
        // Store old email and password to make sure user won't make same mistake twice
        this.oldEmailInput = '';
        this.oldPasswordInput = '';
        // Store number of invalid password attempts to suggest reset password
        this._numberOfLoginAttempts = 0;
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
        this._auth.basicAuth(email, password).subscribe((res) => __awaiter(this, void 0, void 0, function* () {
            this.isLoading = false;
            if (res.operation == 'success') {
                // Successfully logged in, set the access token within AuthService
                this._auth.setAccessToken(res);
            }
            else if (res.operation == 'error') {
                const alert = yield this._alertCtrl.create({
                    header: 'Unable to Log In',
                    message: res.message,
                    buttons: ['Ok'],
                });
                alert.present();
            }
        }), (err) => __awaiter(this, void 0, void 0, function* () {
            this.isLoading = false;
            // Incorrect email or password
            if (err.status == 401) {
                this._numberOfLoginAttempts++;
                // Check how many login attempts this user made, offer to reset password
                if (this._numberOfLoginAttempts > 2) {
                    const alert = yield this._alertCtrl.create({
                        header: 'Trouble Logging In?',
                        message: 'If you\'ve forgotten your password, contact us to have it reset.',
                        buttons: ['Ok'],
                    });
                    alert.present();
                }
                else {
                    const alert = yield this._alertCtrl.create({
                        header: 'Invalid email or password',
                        message: 'The information entered is incorrect. Please try again.',
                        buttons: ['Try Again'],
                    });
                    alert.present();
                }
            }
            else {
                /**
                 * Error not accounted for. Show Message
                 */
                const alert = yield this._alertCtrl.create({
                    header: 'Unable to Log In',
                    message: 'There seems to be an issue connecting to Payroll servers. Please contact us if the issue persists.',
                    buttons: ['Ok'],
                });
                alert.present();
            }
        }));
    }
};
LoginPage = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.page.html',
        styleUrls: ['./login.page.scss'],
    })
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.page.js.map