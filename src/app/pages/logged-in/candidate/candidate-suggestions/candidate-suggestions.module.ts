import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateSuggestionsPageRoutingModule } from './candidate-suggestions-routing.module';

import { CandidateSuggestionsPage } from './candidate-suggestions.page';
import { NoteModule } from 'src/app/components/note/note.module';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {SuggestionModule} from "../../../../components/suggestion/suggestion.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NoteModule,
        LoadingModalModule,
        CandidateSuggestionsPageRoutingModule,
        SuggestionModule
    ],
  declarations: [CandidateSuggestionsPage]
})
export class CandidateSuggestionsPageModule {}
