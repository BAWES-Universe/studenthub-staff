import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyContactFormPageRoutingModule } from './company-contact-form-routing.module';
import { CompanyContactFormPage } from './company-contact-form.page';
let CompanyContactFormPageModule = class CompanyContactFormPageModule {
};
CompanyContactFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            CompanyContactFormPageRoutingModule
        ],
        declarations: [CompanyContactFormPage]
    })
], CompanyContactFormPageModule);
export { CompanyContactFormPageModule };
//# sourceMappingURL=company-contact-form.module.js.map