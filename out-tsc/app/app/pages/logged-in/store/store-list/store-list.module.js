import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreListPageRoutingModule } from './store-list-routing.module';
import { StoreListPage } from './store-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
let StoreListPageModule = class StoreListPageModule {
};
StoreListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            IonicModule,
            StoreListPageRoutingModule,
            LoadingModalModule
        ],
        declarations: [StoreListPage]
    })
], StoreListPageModule);
export { StoreListPageModule };
//# sourceMappingURL=store-list.module.js.map