import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagFormPageRoutingModule } from './tag-form-routing.module';

import { TagFormPage } from './tag-form.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    TagFormPageRoutingModule
  ],
  declarations: [TagFormPage]
})
export class TagFormPageModule {}
