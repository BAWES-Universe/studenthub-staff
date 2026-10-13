import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InstantSearchCompatModule } from 'src/app/compat/instantsearch';
import { BawesAisPaginationComponent } from './bawes-ais-pagination.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [        
    BawesAisPaginationComponent
  ],
  imports: [
      IonicModule,
      InstantSearchCompatModule,
      CommonModule,
      TranslateModule.forChild(),
  ],
  exports: [
    BawesAisPaginationComponent
  ]
})
export class BawesAisPaginationModuleModule { }
