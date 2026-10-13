import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { IsFacetsSearchComponent } from './is-facets-search.component';
import { InstantSearchCompatModule } from 'src/app/compat/instantsearch';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [       
        IsFacetsSearchComponent
    ],
    imports: [
        IonicModule,
        InstantSearchCompatModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsFacetsSearchComponent
    ]
})
export class IsFacetsSearchModule { }