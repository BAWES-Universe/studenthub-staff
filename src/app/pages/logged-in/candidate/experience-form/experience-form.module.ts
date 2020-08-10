import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperienceFormPageRoutingModule } from './experience-form-routing.module';

import { ExperienceFormPage } from './experience-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ExperienceFormPageRoutingModule
  ],
  declarations: [ExperienceFormPage]
})
export class ExperienceFormPageModule {}
