import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyFollowupNotePageRoutingModule } from './company-followup-note-routing.module';

import { CompanyFollowupNotePage } from './company-followup-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CompanyFollowupNotePageRoutingModule
  ],
  declarations: [CompanyFollowupNotePage]
})
export class CompanyFollowupNotePageModule {}
