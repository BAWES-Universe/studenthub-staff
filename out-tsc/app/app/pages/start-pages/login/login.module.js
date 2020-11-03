import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
let LoginPageModule = class LoginPageModule {
};
LoginPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            FormsModule,
            IonicModule,
            LoginPageRoutingModule
        ],
        declarations: [LoginPage]
    })
], LoginPageModule);
export { LoginPageModule };
//# sourceMappingURL=login.module.js.map