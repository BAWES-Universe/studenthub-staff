import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrandFormPageRoutingModule } from './brand-form-routing.module';
import { BrandFormPage } from './brand-form.page';
let BrandFormPageModule = class BrandFormPageModule {
};
BrandFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            BrandFormPageRoutingModule
        ],
        declarations: [BrandFormPage]
    })
], BrandFormPageModule);
export { BrandFormPageModule };
//# sourceMappingURL=brand-form.module.js.map