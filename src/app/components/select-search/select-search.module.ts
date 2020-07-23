import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SelectSearchPageComponent } from './select-search-page/select-search-page.component';
import { SelectSearchInputComponent } from './select-search-input/select-search-input.component';

@NgModule({
  declarations: [SelectSearchInputComponent, SelectSearchPageComponent],
  entryComponents: [SelectSearchPageComponent],
  imports: [IonicModule, FormsModule, CommonModule],
  exports: [SelectSearchInputComponent]
})
export class SelectSearchModule{}
