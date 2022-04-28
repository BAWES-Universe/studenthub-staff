import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NgAisModule } from 'angular-instantsearch';

import { PipesModule } from '../../pipes/pipes.module';
import { DateRangeRefinementListComponent } from './date-range-refinement-list.component';


@NgModule({
  declarations: [
    DateRangeRefinementListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgAisModule, 
    FormsModule,
    PipesModule,
  ],
  exports: [
    DateRangeRefinementListComponent
  ]
})
export class DateRangeRefinementListModule { }
