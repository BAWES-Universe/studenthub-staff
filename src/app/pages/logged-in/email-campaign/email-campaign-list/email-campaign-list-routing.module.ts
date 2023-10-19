import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailCampaignListPage } from './email-campaign-list.page';

const routes: Routes = [
  {
    path: '',
    component: EmailCampaignListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailCampaignListPageRoutingModule {}
