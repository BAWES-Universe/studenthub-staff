import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RefinementListComponent } from './refinement-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentRefinementModule } from '../current-refinement/current-refinement.module';
import { IsFacetsSearchModule } from '../is-facets-search/is-facets-search.module';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [        
        RefinementListComponent
    ],
    imports: [
        CurrentRefinementModule,
        IonicModule,
        IsFacetsSearchModule,
        CommonModule,
        TranslateModule.forChild(),
    ],
    exports: [
        RefinementListComponent
    ]
})
export class RefinementListModule { }