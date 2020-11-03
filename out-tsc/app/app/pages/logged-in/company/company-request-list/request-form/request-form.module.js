import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestFormPageRoutingModule } from './request-form-routing.module';
import { RequestFormPage } from './request-form.page';
let RequestFormPageModule = class RequestFormPageModule {
};
RequestFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            RequestFormPageRoutingModule
        ],
        declarations: [RequestFormPage]
    })
], RequestFormPageModule);
export { RequestFormPageModule };
//# sourceMappingURL=request-form.module.js.map