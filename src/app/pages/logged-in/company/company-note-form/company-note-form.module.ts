import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyNoteFormPageRoutingModule } from './company-note-form-routing.module';

import { CompanyNoteFormPage } from './company-note-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CompanyNoteFormPageRoutingModule
  ],
  declarations: [CompanyNoteFormPage]
})
export class CompanyNoteFormPageModule {}
