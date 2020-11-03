import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgAisModule } from "angular-instantsearch";
import { CandidateFilterModule } from "../../../../components/candidate-filter/candidate-filter.module";
import { InstantSearchModule } from "../../../../components/instant-search/instant-search.module";
import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import { CandidateFilterPageRoutingModule } from './candidate-filter-routing.module';
import { CandidateFilterPage } from './candidate-filter.page';
let CandidateFilterPageModule = class CandidateFilterPageModule {
};
CandidateFilterPageModule = __decorate([
    NgModule({
        imports: [
            NgAisModule,
            CandidateFilterModule,
            InstantSearchModule,
            LoadingModalModule,
            TranslateModule.forChild(),
            CommonModule,
            FormsModule,
            IonicModule,
            CandidateFilterPageRoutingModule
        ],
        declarations: [CandidateFilterPage]
    })
], CandidateFilterPageModule);
export { CandidateFilterPageModule };
//# sourceMappingURL=candidate-filter.module.js.map