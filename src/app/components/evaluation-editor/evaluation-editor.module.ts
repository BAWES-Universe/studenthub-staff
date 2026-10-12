import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EvaluationEditorComponent } from './evaluation-editor.component';
import { EvaluationPresetModalComponent } from './evaluation-preset-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    EvaluationEditorComponent,
    EvaluationPresetModalComponent
  ],
  exports: [
    EvaluationEditorComponent,
    EvaluationPresetModalComponent
  ]
})
export class EvaluationEditorModule {}
