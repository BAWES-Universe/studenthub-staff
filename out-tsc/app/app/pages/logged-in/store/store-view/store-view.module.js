import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreViewPageRoutingModule } from './store-view-routing.module';
import { StoreViewPage } from './store-view.page';
import { LoadingModalModule } from "src/app/components/loading-modal/loading-modal.module";
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
let StoreViewPageModule = class StoreViewPageModule {
};
StoreViewPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            CandidateModule,
            StoreViewPageRoutingModule,
            LoadingModalModule
        ],
        declarations: [StoreViewPage]
    })
], StoreViewPageModule);
export { StoreViewPageModule };
//# sourceMappingURL=store-view.module.js.map