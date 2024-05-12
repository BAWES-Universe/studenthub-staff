import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestViewRoutingModule } from './company-request-view-routing.module';

import { CompanyRequestViewPage } from './company-request-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RecentActivityComponent } from 'src/app/components/recent-activity/recent-activity.component';
import { SuggestionModule } from 'src/app/components/suggestion/suggestion.module';
import { InvitationModule } from 'src/app/components/invitation/invitation.module';
import { RequestOptionPage } from './company-request-option.page';
import { NoteModule } from 'src/app/components/note/note.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { StoryItemModule } from 'src/app/components/story-item/story-item.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    SuggestionModule,
    InvitationModule,
    LoadingModalModule,
    TranslateModule.forChild(),
    NoteModule,
    NoItemsModule,
    LoadingModalModule,
    SuggestionModule,
    StoryItemModule,
    CandidateModule,
    CompanyRequestViewRoutingModule
  ],
  declarations: [
    CompanyRequestViewPage, 
    RecentActivityComponent,
    RequestOptionPage
  ]
})
export class CompanyRequestViewPageModule { }
