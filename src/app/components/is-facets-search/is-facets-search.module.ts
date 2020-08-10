import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { IsFacetsSearchComponent } from './is-facets-search.component';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [       
        IsFacetsSearchComponent
    ],
    imports: [
        IonicModule,
        NgAisModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsFacetsSearchComponent
    ]
})
export class IsFacetsSearchModule { }