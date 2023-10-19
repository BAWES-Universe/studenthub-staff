import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailCampaignViewPage } from './email-campaign-view.page';

const routes: Routes = [
  {
    path: ':campaign_uuid',
    component: EmailCampaignViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailCampaignViewPageRoutingModule {}
