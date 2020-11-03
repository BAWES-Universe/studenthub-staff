import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyRequestFormPageRoutingModule } from './company-request-form-routing.module';
import { CompanyRequestFormPage } from './company-request-form.page';
let CompanyRequestFormPageModule = class CompanyRequestFormPageModule {
};
CompanyRequestFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            CompanyRequestFormPageRoutingModule
        ],
        declarations: [CompanyRequestFormPage]
    })
], CompanyRequestFormPageModule);
export { CompanyRequestFormPageModule };
//# sourceMappingURL=company-request-form.module.js.map