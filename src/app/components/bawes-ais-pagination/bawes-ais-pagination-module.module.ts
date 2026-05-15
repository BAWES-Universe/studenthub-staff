import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AisBridgeModule } from '../ais-bridge/ais-bridge.module';
import { BawesAisPaginationComponent } from './bawes-ais-pagination.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [        
    BawesAisPaginationComponent
  ],
  imports: [
      IonicModule,
      AisBridgeModule,
      CommonModule,
      TranslateModule.forChild(),
  ],
  exports: [
    BawesAisPaginationComponent
  ]
})
export class BawesAisPaginationModuleModule { }
