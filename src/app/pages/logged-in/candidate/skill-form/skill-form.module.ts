import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SkillFormPageRoutingModule } from './skill-form-routing.module';

import { SkillFormPage } from './skill-form.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    SkillFormPageRoutingModule
  ],
  declarations: [SkillFormPage]
})
export class SkillFormPageModule {}
