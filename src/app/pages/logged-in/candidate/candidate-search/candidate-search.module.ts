import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateSearchPageRoutingModule } from './candidate-search-routing.module';

import { CandidateSearchPage } from './candidate-search.page';

import { CandidateFilterModule } from '../../../../components/candidate-filter/candidate-filter.module';
import { AppliedFiltersModule } from '../../../../components/applied-filters/applied-filters.module';
import { LoadingModalModule } from '../../../../components/loading-modal/loading-modal.module';
import { CandidateModule } from '../../../../components/candidate/candidate.module';
import { NoItemsModule } from '../../../../components/no-items/no-items.module';
import { TranslateModule } from '@ngx-translate/core';
import { BawesAisPaginationModuleModule } from 'src/app/components/bawes-ais-pagination/bawes-ais-pagination-module.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateFilterModule,
    BawesAisPaginationModuleModule,
    AppliedFiltersModule,
    LoadingModalModule,
    CandidateModule,
    NoItemsModule,
    TranslateModule.forChild(),
    CandidateSearchPageRoutingModule
  ],
  declarations: [CandidateSearchPage]
})
export class CandidateSearchPageModule { }
