import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { DateDropdownComponent } from './date-dropdown.component';

@NgModule({
  declarations: [
    DateDropdownComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    DateDropdownComponent
  ]
})
export class DateDropdownModule { }
