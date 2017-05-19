import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SelectSearchInputComponent } from './select-search-input/select-search-input';
import { SelectSearchPage } from './select-search-page/select-search-page';

@NgModule({
  declarations: [SelectSearchInputComponent, SelectSearchPage],
  entryComponents: [SelectSearchPage],
  imports: [IonicModule],
  exports: [SelectSearchInputComponent]
})
export class SelectSearchModule { }