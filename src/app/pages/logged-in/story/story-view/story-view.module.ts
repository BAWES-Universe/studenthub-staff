import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryViewPageRoutingModule } from './story-view-routing.module';

import { StoryViewPage } from './story-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { NoteModule } from 'src/app/components/note/note.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { InvitationModule } from 'src/app/components/invitation/invitation.module';
import { StoryViewOptionPage } from './story-view-option.page';
import { StoryCloseConfirmationComponent } from './story-close-confirmation.component';
import { SuggestionModule } from "../../../../components/suggestion/suggestion.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NoteModule,
    PipesModule,
    IonicModule,
    InvitationModule,
    StoryViewPageRoutingModule,
    NoItemsModule,
    LoadingModalModule,
    SuggestionModule,
    PipesModule
  ],
  declarations: [
    StoryViewPage,
    StoryViewOptionPage,
    StoryCloseConfirmationComponent
  ],
  exports: [
    StoryViewOptionPage
  ]
})
export class StoryViewPageModule { }
