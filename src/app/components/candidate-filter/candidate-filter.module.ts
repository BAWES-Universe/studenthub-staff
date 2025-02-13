import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CandidateFilterComponent } from './candidate-filter';
import { NgAisModule } from 'angular-instantsearch';
import { RefinementListModule } from '../refinement-list/refinement-list.module'; 
import {CommonModule} from "@angular/common";
import { RangeRefinementModule } from '../range-refinement-list/range-refinement-list.module';
import { DateRangeRefinementListModule } from '../date-range-refinement-list/date-range-refinement-list.module';
import { AgeRefinementListModule } from '../age-refinement-list/age-refinement-list.module';

@NgModule({
  declarations: [
    CandidateFilterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    IonicModule, 
    NgAisModule, 
    AgeRefinementListModule,
    RangeRefinementModule,
    RefinementListModule,
    DateRangeRefinementListModule
  ],
  exports: [
    CandidateFilterComponent
  ]
})
export class CandidateFilterModule { }
