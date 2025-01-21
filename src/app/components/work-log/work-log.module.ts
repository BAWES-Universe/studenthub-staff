import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import {TranslateModule} from "@ngx-translate/core";
import { WorkLogComponent } from './work-log.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [WorkLogComponent],
    imports: [
        IonicModule,
        PipesModule,
        CommonModule,
        TranslateModule.forChild()
    ],
    exports: [WorkLogComponent]
})
export class WorkLogModule { }
