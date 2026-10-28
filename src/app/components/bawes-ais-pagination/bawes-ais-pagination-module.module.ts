import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InstantSearchModule } from 'src/app/components/instantsearch/instantsearch';
import { BawesAisPaginationComponent } from './bawes-ais-pagination.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [        
    BawesAisPaginationComponent
  ],
  imports: [
      IonicModule,
      InstantSearchModule,
      CommonModule,
      TranslateModule.forChild(),
  ],
  exports: [
    BawesAisPaginationComponent
  ]
})
export class BawesAisPaginationModuleModule { }
