import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DefaultPageRoutingModule } from './default-routing.module';
import { DefaultPage } from './default.page';
import { LoadingModalModule } from "../../../components/loading-modal/loading-modal.module";
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';
let DefaultPageModule = class DefaultPageModule {
};
DefaultPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            DefaultPageRoutingModule,
            RequestListingModule,
            LoadingModalModule
        ],
        declarations: [DefaultPage]
    })
], DefaultPageModule);
export { DefaultPageModule };
//# sourceMappingURL=default.module.js.map