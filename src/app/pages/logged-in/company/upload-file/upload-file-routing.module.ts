import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadFilePage } from './upload-file.page';

const routes: Routes = [
  {
    path: '',
    component: UploadFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadFilePageRoutingModule {}
