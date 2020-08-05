import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { NgAisModule } from "angular-instantsearch";
import { CandidateFilterModule } from "../../../../components/candidate-filter/candidate-filter.module";
import { InstantSearchModule } from "../../../../components/instant-search/instant-search.module";
import { IsInfiniteHitsModule } from '../../../../components/is-infinite-hits/is-infinite-hits.module';
import { RefinementListModule } from '../../../../components/refinement-list/refinement-list.module';
import { AppliedFiltersModule } from '../../../../components/applied-filters/applied-filters.module';
import { IsSearchBoxModule } from '../../../../components/is-search-box/is-search-box.module';
import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import { CandidateModule } from '../../../../components/candidate/candidate.module';
import { NoItemsModule } from '../../../../components/no-items/no-items.module';

import { CandidateFilterPageRoutingModule } from './candidate-filter-routing.module';

import { CandidateFilterPage } from './candidate-filter.page';

@NgModule({
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
export class CandidateFilterPageModule { }
