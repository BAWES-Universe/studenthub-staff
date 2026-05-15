import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BawesAisPaginationComponent } from './bawes-ais-pagination.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [        
    BawesAisPaginationComponent
  ],
  imports: [
      IonicModule,
      CommonModule,
      TranslateModule.forChild(),
  ],
  exports: [
    BawesAisPaginationComponent
  ]
})
export class BawesAisPaginationModuleModule { }
