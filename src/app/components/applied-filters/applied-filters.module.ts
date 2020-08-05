import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { AppliedFiltersComponent } from './applied-filters.component';
import { CommonModule, CurrencyPipe } from '@angular/common';

@NgModule({
    declarations: [       
        AppliedFiltersComponent
    ],
    providers: [
        CurrencyPipe      
    ],
    imports: [
        CommonModule,
        IonicModule,
        NgAisModule,
        TranslateModule.forChild(),
    ],
    exports: [
        AppliedFiltersComponent
    ]
})
export class AppliedFiltersModule { }