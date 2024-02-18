import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryModalComponent } from './country-modal.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CountryModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  exports: [
    CountryModalComponent
  ]
})
export class CountryModalModule { }
