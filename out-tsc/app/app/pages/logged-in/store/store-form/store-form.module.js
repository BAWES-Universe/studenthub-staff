import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreFormPageRoutingModule } from './store-form-routing.module';
import { StoreFormPage } from './store-form.page';
let StoreFormPageModule = class StoreFormPageModule {
};
StoreFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            IonicModule,
            StoreFormPageRoutingModule
        ],
        declarations: [StoreFormPage]
    })
], StoreFormPageModule);
export { StoreFormPageModule };
//# sourceMappingURL=store-form.module.js.map