import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingController, ModalController} from "@ionic/angular";
import {CandidateEvaluationService} from "src/app/providers/logged-in/candidate-evaluation.service";
import {EvaluationReportViewPage} from "../evaluation-report-view/evaluation-report-view.page";

@Component({
  selector: 'app-evaluation-report-list',
  templateUrl: './evaluation-report-list.page.html',
  styleUrls: ['./evaluation-report-list.page.scss'],
})
export class EvaluationReportListPage implements OnInit {

  public candidateID;
  public loading = false;
  public reports;
  public totalPages = 0;
  public currentPage = 1;
  public totalRecord = 0;

  constructor(
    public activeRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public canEvalService: CandidateEvaluationService,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.candidateID = this.activeRoute.snapshot.params['candidateID'];
  }

  ionViewWillEnter() {
    this.loadData();
  }

  /**
   * loading data
   */
  loadData() {
    this.loading = true;
    let param = '&expand=department,staff,candidate';
    this.canEvalService.listReport(this.candidateID, 1, param).subscribe(response => {
      this.reports = response.body;
      this.totalPages = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');
      this.totalRecord = response.headers.get('X-Pagination-Total-Count');
      this.loading = false;
    })
  }

  /**
   * view detail
   * @param report
   */
  async viewDetail(report) {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: EvaluationReportViewPage,
      componentProps: {
        report,
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
  }

  /**
   * load more
   * @param ev
   */
  onIonInfinite(ev) {
    this.currentPage ++ ;
    this.loading = true;
    let param = '&expand=department,staff,candidate';
    this.canEvalService.listReport(this.candidateID, this.currentPage, param).subscribe(response => {
      this.reports = this.reports.concat(response.body);
      this.totalPages = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');
      this.totalRecord = response.headers.get('X-Pagination-Total-Count');
      this.loading = false;
      ev.target.complete();
    })
  }

  async downloadPdf($event, report) {
    $event.preventDefault();
    $event.stopPropagation();
    const loading = await this.loadingCtrl.create();
    loading.present();
    let candidateName = report.candidate.candidate_name.replaceAll(' ', '-').toLowerCase();
    let dept = report.department.replaceAll(' ', '-').toLowerCase();
    let name = `${candidateName}_${dept}-report`;
    this.canEvalService.downloadReport(report.can_eval_uuid,name).subscribe(response => {
      console.log('download file');
    },err => loading.dismiss(),
      () => loading.dismiss()
    )
  }
}
