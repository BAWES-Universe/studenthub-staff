import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateTagsPageRoutingModule } from './candidate-tags-routing.module';

import { CandidateTagsPage } from './candidate-tags.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    LoadingModalModule,
    CandidateTagsPageRoutingModule
  ],
  declarations: [CandidateTagsPage]
})
export class CandidateTagsPageModule {}
