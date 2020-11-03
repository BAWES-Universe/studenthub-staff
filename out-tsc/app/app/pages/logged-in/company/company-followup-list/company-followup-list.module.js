import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyFollowupListPageRoutingModule } from './company-followup-list-routing.module';
import { CompanyFollowupListPage } from './company-followup-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
let CompanyFollowupListPageModule = class CompanyFollowupListPageModule {
};
CompanyFollowupListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            LoadingModalModule,
            PipesModule,
            CompanyFollowupListPageRoutingModule
        ],
        declarations: [CompanyFollowupListPage]
    })
], CompanyFollowupListPageModule);
export { CompanyFollowupListPageModule };
//# sourceMappingURL=company-followup-list.module.js.map