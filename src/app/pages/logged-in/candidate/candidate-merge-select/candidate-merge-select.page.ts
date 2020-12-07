import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
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
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  dismiss(event, candidate = null) {
    event.stopPropagation();
    event.preventDefault();
    
    this.popoverCtrl.dismiss({ candidate: candidate });
  }
}
