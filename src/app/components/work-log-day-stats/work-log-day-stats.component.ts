import { Component, Input, OnInit } from '@angular/core';
import { CandidateWorkingDate } from 'src/app/models/candidate-working-date';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-work-log-day-stats',
  templateUrl: './work-log-day-stats.component.html',
  styleUrls: ['./work-log-day-stats.component.scss'],
})
export class WorkLogDayStatsComponent implements OnInit {
  
  @Input() public candidateWorkingDate: CandidateWorkingDate; 
  
  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}
}
