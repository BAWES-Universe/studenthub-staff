import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateSearchPageRoutingModule } from './candidate-search-routing.module';

import { CandidateSearchPage } from './candidate-search.page';

import {InstantSearchModule} from '../../../../components/instant-search/instant-search.module';
import {IsInfiniteHitsModule} from '../../../../components/is-infinite-hits/is-infinite-hits.module';
import {IsSearchBoxModule} from '../../../../components/is-search-box/is-search-box.module';
import {RefinementListModule} from '../../../../components/refinement-list/refinement-list.module';
import {CandidateFilterModule} from '../../../../components/candidate-filter/candidate-filter.module';
import {AppliedFiltersModule} from '../../../../components/applied-filters/applied-filters.module';
import {LoadingModalModule} from '../../../../components/loading-modal/loading-modal.module';
import {CandidateModule} from '../../../../components/candidate/candidate.module';
import {NoItemsModule} from '../../../../components/no-items/no-items.module';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgAisModule, 
    InstantSearchModule,
    IsInfiniteHitsModule,
    RefinementListModule,
    CandidateFilterModule,
    AppliedFiltersModule,
    IsSearchBoxModule,
    LoadingModalModule,
    CandidateModule,
    NoItemsModule,
    TranslateModule.forChild(),
    CandidateSearchPageRoutingModule
  ],
  declarations: [CandidateSearchPage]
})
export class CandidateSearchPageModule {}
