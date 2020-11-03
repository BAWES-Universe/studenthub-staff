import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MallViewPageRoutingModule } from './mall-view-routing.module';
import { MallViewPage } from './mall-view.page';
import { CandidateModule } from "../../../../components/candidate/candidate.module";
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
let MallViewPageModule = class MallViewPageModule {
};
MallViewPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            MallViewPageRoutingModule,
            CandidateModule,
            NoItemsModule,
            LoadingModalModule
        ],
        declarations: [MallViewPage]
    })
], MallViewPageModule);
export { MallViewPageModule };
//# sourceMappingURL=mall-view.module.js.map