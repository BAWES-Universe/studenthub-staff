import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Candidate } from 'src/app/models/candidate';

@Component({
  selector: 'app-job-search-status',
  templateUrl: './job-search-status.component.html',
  styleUrls: ['./job-search-status.component.scss'],
})
export class JobSearchStatusComponent implements OnInit {

  @Input() candidate: Candidate;

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  dismiss(data = {}) {
    this.popoverCtrl.dismiss(data);
  }

  updateJobSearchStatus(job_search_status) {
    this.dismiss({
      job_search_status: job_search_status
    });
  }
}
