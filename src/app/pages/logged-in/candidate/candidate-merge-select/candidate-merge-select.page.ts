import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'app-candidate-merge-select',
  templateUrl: './candidate-merge-select.page.html',
  styleUrls: ['./candidate-merge-select.page.scss'],
})
export class CandidateMergeSelectPage implements OnInit {

  constructor(
    public candidateService: CandidateService,
    public popoverCtrl: PopoverController,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Candidate Merge Select Page');
  }

  dismiss(event, candidate = null) {
    event.stopPropagation();
    event.preventDefault();
    
    this.popoverCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ candidate: candidate });
      }
    });
  }
}
