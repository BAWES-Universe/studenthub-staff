import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyRequestListPageRoutingModule } from './company-request-list-routing.module';
import { CompanyRequestListPage } from './company-request-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
let CompanyRequestListPageModule = class CompanyRequestListPageModule {
};
CompanyRequestListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            LoadingModalModule,
            PipesModule,
            CompanyRequestListPageRoutingModule
        ],
        declarations: [CompanyRequestListPage]
    })
], CompanyRequestListPageModule);
export { CompanyRequestListPageModule };
//# sourceMappingURL=company-request-list.module.js.map