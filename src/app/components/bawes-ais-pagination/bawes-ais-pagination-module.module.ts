import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgAisModule } from 'angular-instantsearch';
import { BawesAisPaginationComponent } from './bawes-ais-pagination.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [        
    BawesAisPaginationComponent
  ],
  imports: [
      IonicModule,
      NgAisModule,
      CommonModule,
      TranslateModule.forChild(),
  ],
  exports: [
    BawesAisPaginationComponent
  ]
})
export class BawesAisPaginationModuleModule { }
