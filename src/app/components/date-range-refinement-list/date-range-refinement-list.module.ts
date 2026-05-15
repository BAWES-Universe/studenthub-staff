import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AisBridgeModule } from '../ais-bridge/ais-bridge.module';

import { PipesModule } from '../../pipes/pipes.module';
import { DateRangeRefinementListComponent } from './date-range-refinement-list.component';


@NgModule({
  declarations: [
    DateRangeRefinementListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AisBridgeModule, 
    FormsModule,
    PipesModule,
  ],
  exports: [
    DateRangeRefinementListComponent
  ]
})
export class DateRangeRefinementListModule { }
