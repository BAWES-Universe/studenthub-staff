import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateFilterComponent } from './candidate-filter';
import { NgAisModule } from 'angular-instantsearch';
import { RefinementListModule } from '../refinement-list/refinement-list.module';
import { CommonModule } from "@angular/common";
let CandidateFilterModule = class CandidateFilterModule {
};
CandidateFilterModule = __decorate([
    NgModule({
        declarations: [
            CandidateFilterComponent
        ],
        imports: [
            CommonModule,
            TranslateModule.forChild(),
            IonicModule,
            NgAisModule,
            RefinementListModule
        ],
        exports: [
            CandidateFilterComponent
        ]
    })
], CandidateFilterModule);
export { CandidateFilterModule };
//# sourceMappingURL=candidate-filter.module.js.map