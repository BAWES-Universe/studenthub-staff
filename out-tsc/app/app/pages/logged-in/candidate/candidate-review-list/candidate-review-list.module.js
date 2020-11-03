import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CandidateReviewListPageRoutingModule } from './candidate-review-list-routing.module';
import { CandidateReviewListPage } from './candidate-review-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { CandidateModule } from "../../../../components/candidate/candidate.module";
let CandidateReviewListPageModule = class CandidateReviewListPageModule {
};
CandidateReviewListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            LoadingModalModule,
            CandidateReviewListPageRoutingModule,
            CandidateModule
        ],
        declarations: [CandidateReviewListPage]
    })
], CandidateReviewListPageModule);
export { CandidateReviewListPageModule };
//# sourceMappingURL=candidate-review-list.module.js.map