import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreManagerFormPageRoutingModule } from './store-manager-form-routing.module';
import { StoreManagerFormPage } from './store-manager-form.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
let StoreManagerFormPageModule = class StoreManagerFormPageModule {
};
StoreManagerFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            LoadingModalModule,
            StoreManagerFormPageRoutingModule
        ],
        declarations: [StoreManagerFormPage]
    })
], StoreManagerFormPageModule);
export { StoreManagerFormPageModule };
//# sourceMappingURL=store-manager-form.module.js.map