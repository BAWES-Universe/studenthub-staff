import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { FulltimerFilterComponent } from './fulltimer-filter';
import { NgAisModule } from 'angular-instantsearch';
import { RefinementListModule } from '../refinement-list/refinement-list.module';
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [
    FulltimerFilterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    IonicModule,
    NgAisModule,
    RefinementListModule
  ],
  exports: [
    FulltimerFilterComponent
  ]
})
export class FulltimerFilterModule { }
