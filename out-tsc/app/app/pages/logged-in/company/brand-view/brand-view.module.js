import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrandViewPageRoutingModule } from './brand-view-routing.module';
import { BrandViewPage } from './brand-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
let BrandViewPageModule = class BrandViewPageModule {
};
BrandViewPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            CandidateModule,
            BrandViewPageRoutingModule,
            LoadingModalModule
        ],
        declarations: [BrandViewPage]
    })
], BrandViewPageModule);
export { BrandViewPageModule };
//# sourceMappingURL=brand-view.module.js.map