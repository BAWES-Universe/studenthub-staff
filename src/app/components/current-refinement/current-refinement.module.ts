import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AisBridgeModule } from '../ais-bridge/ais-bridge.module';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentRefinementComponent } from './current-refinement.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
    declarations: [       
        CurrentRefinementComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        AisBridgeModule,
        PipesModule,
        TranslateModule.forChild(),
    ],
    exports: [
        CurrentRefinementComponent
    ]
})
export class CurrentRefinementModule { }