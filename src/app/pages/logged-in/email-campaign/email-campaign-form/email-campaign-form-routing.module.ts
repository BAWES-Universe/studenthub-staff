import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailCampaignFormPage } from './email-campaign-form.page';

const routes: Routes = [
  {
    path: '',
    component: EmailCampaignFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailCampaignFormPageRoutingModule {}
