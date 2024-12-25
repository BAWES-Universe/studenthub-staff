import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkLogDayStatsComponent } from './work-log-day-stats.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [WorkLogDayStatsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    TranslateModule.forChild()
  ],
  exports: [
    WorkLogDayStatsComponent
  ]
})
export class WorkLogDayStatsModule { }
