import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExpiredIdPageRoutingModule } from './expired-id-routing.module';
import { ExpiredIdPage } from './expired-id.page';
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
import { NoItemsModule } from "../../../../components/no-items/no-items.module";
let ExpiredIdPageModule = class ExpiredIdPageModule {
};
ExpiredIdPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            IonicModule,
            ExpiredIdPageRoutingModule,
            LoadingModalModule,
            NoItemsModule
        ],
        declarations: [ExpiredIdPage]
    })
], ExpiredIdPageModule);
export { ExpiredIdPageModule };
//# sourceMappingURL=expired-id.module.js.map