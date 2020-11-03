import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChangePasswordPage } from './change-password.page';
const routes = [
    {
        path: '',
        component: ChangePasswordPage
    }
];
let ChangePasswordPageRoutingModule = class ChangePasswordPageRoutingModule {
};
ChangePasswordPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], ChangePasswordPageRoutingModule);
export { ChangePasswordPageRoutingModule };
//# sourceMappingURL=change-password-routing.module.js.map