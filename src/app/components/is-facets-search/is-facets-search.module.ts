import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { IsFacetsSearchComponent } from './is-facets-search.component';
import { AisBridgeModule } from '../ais-bridge/ais-bridge.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [       
        IsFacetsSearchComponent
    ],
    imports: [
        IonicModule,
        AisBridgeModule,
        TranslateModule.forChild(),
    ],
    exports: [
        IsFacetsSearchComponent
    ]
})
export class IsFacetsSearchModule { }