import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulltimerSearchPageRoutingModule } from './fulltimer-search-routing.module';

import { FulltimerSearchPage } from './fulltimer-search.page';

import { AppliedFiltersModule } from '../../../../components/applied-filters/applied-filters.module';
import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import { NoItemsModule } from '../../../../components/no-items/no-items.module';
import { NgAisModule } from 'angular-instantsearch';
import { FulltimerFilterModule } from 'src/app/components/fulltimer-filter/fulltimer-filter.module';
import { BawesAisPaginationModuleModule } from 'src/app/components/bawes-ais-pagination/bawes-ais-pagination-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FulltimerSearchPageRoutingModule,
    BawesAisPaginationModuleModule,
    NgAisModule,
    FulltimerFilterModule,
    AppliedFiltersModule,
    LoadingModalModule,
    NoItemsModule
  ],
  declarations: [FulltimerSearchPage]
})
export class FulltimerSearchPageModule {}
