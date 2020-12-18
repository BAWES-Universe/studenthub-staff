import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateNotesPageRoutingModule } from './candidate-notes-routing.module';

import { CandidateNotesPage } from './candidate-notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateNotesPageRoutingModule
  ],
  declarations: [CandidateNotesPage]
})
export class CandidateNotesPageModule {}
