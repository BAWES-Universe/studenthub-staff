import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MallFormPageRoutingModule } from './mall-form-routing.module';
import { MallFormPage } from './mall-form.page';
let MallFormPageModule = class MallFormPageModule {
};
MallFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            IonicModule,
            MallFormPageRoutingModule
        ],
        declarations: [MallFormPage]
    })
], MallFormPageModule);
export { MallFormPageModule };
//# sourceMappingURL=mall-form.module.js.map