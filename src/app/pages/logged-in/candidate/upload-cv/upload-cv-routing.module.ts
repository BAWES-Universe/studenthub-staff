import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadCvPage } from './upload-cv.page';

const routes: Routes = [
  {
    path: '',
    component: UploadCvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadCvPageRoutingModule {}
