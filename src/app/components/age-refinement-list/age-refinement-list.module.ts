import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { NgAisModule } from 'angular-instantsearch';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { AgeRefinementListComponent } from './age-refinement-list.component';

@NgModule({ 
  declarations: [     
    AgeRefinementListComponent
  ],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      PipesModule,
      NgxSliderModule,
  ],
  exports: [
      AgeRefinementListComponent
  ]
})
export class AgeRefinementListModule { }
