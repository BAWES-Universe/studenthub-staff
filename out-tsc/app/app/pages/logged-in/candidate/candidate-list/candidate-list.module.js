import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CandidateListPageRoutingModule } from './candidate-list-routing.module';
import { CandidateListPage } from './candidate-list.page';
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
import { NoItemsModule } from "../../../../components/no-items/no-items.module";
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
let CandidateListPageModule = class CandidateListPageModule {
};
CandidateListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            CandidateModule,
            CandidateListPageRoutingModule,
            LoadingModalModule,
            NoItemsModule
        ],
        declarations: [CandidateListPage]
    })
], CandidateListPageModule);
export { CandidateListPageModule };
//# sourceMappingURL=candidate-list.module.js.map