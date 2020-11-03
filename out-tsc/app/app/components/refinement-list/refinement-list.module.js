import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RefinementListComponent } from './refinement-list.component';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentRefinementModule } from '../current-refinement/current-refinement.module';
import { InstantSearchModule } from '../instant-search/instant-search.module';
import { IsFacetsSearchModule } from '../is-facets-search/is-facets-search.module';
import { CommonModule } from '@angular/common';
let RefinementListModule = class RefinementListModule {
};
RefinementListModule = __decorate([
    NgModule({
        declarations: [
            RefinementListComponent
        ],
        imports: [
            CurrentRefinementModule,
            IonicModule,
            NgAisModule,
            InstantSearchModule,
            IsFacetsSearchModule,
            CommonModule,
            //     ais-facets-search,
            //    NgAisFacetsSearch,     
            //    NgAisRefinementListModule,
            TranslateModule.forChild(),
        ],
        exports: [
            InstantSearchModule,
            RefinementListComponent
        ]
    })
], RefinementListModule);
export { RefinementListModule };
//# sourceMappingURL=refinement-list.module.js.map