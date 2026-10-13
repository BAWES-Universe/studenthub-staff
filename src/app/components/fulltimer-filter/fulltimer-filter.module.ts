import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { FulltimerFilterComponent } from './fulltimer-filter';
import { InstantSearchCompatModule } from 'src/app/compat/instantsearch';
import { RefinementListModule } from '../refinement-list/refinement-list.module';
import { CommonModule } from "@angular/common";
import { RangeRefinementModule } from '../range-refinement-list/range-refinement-list.module';


@NgModule({
  declarations: [
    FulltimerFilterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    IonicModule,
    InstantSearchCompatModule,
    RangeRefinementModule,
    RefinementListModule
  ],
  exports: [
    FulltimerFilterComponent
  ]
})
export class FulltimerFilterModule { }
