import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyListPageRoutingModule } from './company-list-routing.module';
import { CompanyListPage } from './company-list.page';
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
import { NoItemsModule } from "../../../../components/no-items/no-items.module";
let CompanyListPageModule = class CompanyListPageModule {
};
CompanyListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            CompanyListPageRoutingModule,
            LoadingModalModule,
            NoItemsModule
        ],
        declarations: [CompanyListPage]
    })
], CompanyListPageModule);
export { CompanyListPageModule };
//# sourceMappingURL=company-list.module.js.map