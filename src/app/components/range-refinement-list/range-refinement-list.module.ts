import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { RangeRefinementComponent } from './range-refinement-list';

import { NgAisModule } from 'angular-instantsearch';
import { Ng5SliderModule } from 'ng5-slider'; 

import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
    declarations: [     
        RangeRefinementComponent
    ],
    imports: [
        IonicModule,
        NgAisModule,
        CommonModule,
        FormsModule,
        PipesModule,
        Ng5SliderModule,
    ],
    exports: [
        RangeRefinementComponent
    ]
})
export class RangeRefinementModule { }
