import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SuggestionComponent } from './suggestion.component';
 

@NgModule({
    declarations: [SuggestionComponent],
    imports: [ 
        CommonModule,
        IonicModule
    ],
    exports: [SuggestionComponent]
})
export class SuggestionModule { }