import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import {CandidateEvaluationService} from "src/app/providers/logged-in/candidate-evaluation.service";

@Component({
  selector: 'app-evaluation-report-view',
  templateUrl: './evaluation-report-view.page.html',
  styleUrls: ['./evaluation-report-view.page.scss'],
})
export class EvaluationReportViewPage implements OnInit {

  public report;
  constructor(
    public modalCtrl: ModalController,
    public canEvalService: CandidateEvaluationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  close(event) {
    this.modalCtrl.getTop().then(res => {
      if (res) {
        res.dismiss();
      }
    })
  }

  loadData() {
    this.canEvalService
      .viewReport(this.report.can_eval_uuid)
      .subscribe(response => {
        this.report = response;
    });
  }
}
