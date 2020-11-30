import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerSearchPageRoutingModule } from './fulltimer-search-routing.module';

import { FulltimerSearchPage } from './fulltimer-search.page';

import { InstantSearchModule } from '../../../../components/instant-search/instant-search.module';
import { IsInfiniteHitsModule } from '../../../../components/is-infinite-hits/is-infinite-hits.module';
import { IsSearchBoxModule } from '../../../../components/is-search-box/is-search-box.module';
import { RefinementListModule } from '../../../../components/refinement-list/refinement-list.module';
import { AppliedFiltersModule } from '../../../../components/applied-filters/applied-filters.module';
import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import { NoItemsModule } from '../../../../components/no-items/no-items.module';
import { NgAisModule } from 'angular-instantsearch';
import { FulltimerFilterModule } from 'src/app/components/fulltimer-filter/fulltimer-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FulltimerSearchPageRoutingModule,
    NgAisModule,
    InstantSearchModule,
    IsInfiniteHitsModule,
    RefinementListModule,
    FulltimerFilterModule,
    AppliedFiltersModule,
    IsSearchBoxModule,
    LoadingModalModule,
    NoItemsModule
  ],
  declarations: [FulltimerSearchPage]
})
export class FulltimerSearchPageModule {}
