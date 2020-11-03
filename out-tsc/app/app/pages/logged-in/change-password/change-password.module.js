import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangePasswordPageRoutingModule } from './change-password-routing.module';
import { ChangePasswordPage } from './change-password.page';
let ChangePasswordPageModule = class ChangePasswordPageModule {
};
ChangePasswordPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            IonicModule,
            ChangePasswordPageRoutingModule
        ],
        declarations: [ChangePasswordPage]
    })
], ChangePasswordPageModule);
export { ChangePasswordPageModule };
//# sourceMappingURL=change-password.module.js.map