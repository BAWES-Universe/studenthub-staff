import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailCampaignViewPageRoutingModule } from './email-campaign-view-routing.module';

import { EmailCampaignViewPage } from './email-campaign-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailCampaignViewPageRoutingModule
  ],
  declarations: [EmailCampaignViewPage]
})
export class EmailCampaignViewPageModule {}
