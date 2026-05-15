import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { IsFacetsSearchComponent } from './is-facets-search.component';
import { InstantSearchModule } from 'src/app/components/instantsearch/instantsearch';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [       
        IsFacetsSearchComponent
    ],
    imports: [
        IonicModule,
        InstantSearchModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsFacetsSearchComponent
    ]
})
export class IsFacetsSearchModule { }