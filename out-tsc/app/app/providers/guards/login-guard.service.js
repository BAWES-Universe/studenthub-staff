import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let LoginGuard = class LoginGuard {
    constructor(_authService, _router) {
        this._authService = _authService;
        this._router = _router;
    }
    canActivate(next, state) {
        if (this._authService.isLogged && this._authService.staff_id) {
            this._router.navigate(['/']);
        }
        // navigate to login page
        // this._router.navigate(['/login']);
        // you can save redirect url so after authing we can move them back to the page they requested
        return true;
    }
};
LoginGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], LoginGuard);
export { LoginGuard };
//# sourceMappingURL=login-guard.service.js.map