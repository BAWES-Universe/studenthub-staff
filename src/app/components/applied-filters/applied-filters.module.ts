import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { AppliedFiltersComponent } from './applied-filters.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PipesModule } from 'src/app/pipes/pipes.module';

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
        PipesModule,
        TranslateModule.forChild(),
    ],
    exports: [
        AppliedFiltersComponent
    ]
})
export class AppliedFiltersModule { }