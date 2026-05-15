import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { IsFacetsSearchComponent } from './is-facets-search.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [       
        IsFacetsSearchComponent
    ],
    imports: [
        IonicModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsFacetsSearchComponent
    ]
})
export class IsFacetsSearchModule { }