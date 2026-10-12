import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController, ViewWillEnter } from '@ionic/angular';
import { EvaluationPresetModalComponent } from 'src/app/components/evaluation-editor/evaluation-preset-modal.component';
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';

@Component({
  selector: 'app-interview-evaluation-list',
  templateUrl: './interview-evaluation-list.page.html',
  styleUrls: ['./interview-evaluation-list.page.scss'],
})
export class InterviewEvaluationListPage implements OnInit, ViewWillEnter {

  public borderLimit;

  public interviewEvaluations: InterviewEvaluation[] = [];
  
  public interviewPageCount = 0;
  public interviewCurrentPage  = 0;
  public interviewTotal = 0;

  public loadingInterviewEvaluations;

  public candidate_id;
  public candidate;

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public interviewEvaluationService: InterviewEvaluationService,
    public analyticService: AnalyticsService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public router: Router,
  ) { }

  ngOnInit() {
    this.analyticService.page('Candidate Interview Evaluations Page');

    const state = window.history.state;

    if (state.candidate) {
      this.candidate = state.candidate;
    }  

    if (!this.candidate_id) {
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');
    }

  }

  ionViewWillEnter() {
    this.interviewCurrentPage = 1;
    this.loadInterviews();
  }

  doRefresh(event) {
    this.interviewCurrentPage = 1;
    this.loadInterviews();
    event.target.complete();
  }

  loadInterviews() {
    this.loadingInterviewEvaluations = true; 

    const urlParams = "&candidate_id=" + this.candidate_id;

    this.interviewEvaluationService.list(this.interviewCurrentPage, urlParams).subscribe(res => {
      this.loadingInterviewEvaluations = false; 

      this.interviewEvaluations = res.body;
      this.interviewPageCount = parseInt(res.headers.get('X-Pagination-Page-Count'));
      this.interviewCurrentPage = parseInt(res.headers.get('X-Pagination-Current-Page'));
      this.interviewTotal = parseInt(res.headers.get('X-Pagination-Total-Count'));
    });
  }

  doInfiniteInterviews(event) {

    this.interviewCurrentPage++;

    const urlParams = "&candidate_id=" + this.candidate_id;

    this.interviewEvaluationService.list(this.interviewCurrentPage, urlParams).subscribe(res => {
      this.loadingInterviewEvaluations = false; 

      event.target.complete();

      this.interviewEvaluations = this.interviewEvaluations.concat(res.body);
      this.interviewPageCount = parseInt(res.headers.get('X-Pagination-Page-Count'));
      this.interviewCurrentPage = parseInt(res.headers.get('X-Pagination-Current-Page'));
      this.interviewTotal = parseInt(res.headers.get('X-Pagination-Total-Count'));
    }, () => {
      this.loadingInterviewEvaluations = false; 

      event.target.complete();
    });
  }

  interviewEvaluationSelected(interviewEvaluation) {
   // this.modalCtrl.dismiss().then(() => {
      this.router.navigate(['/interview-evaluation-view', interviewEvaluation.interview_evaluation_uuid], {
        queryParams: { candidate_id: this.candidate_id }
      });
   // });
  }

  async add() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'New evaluation',
      buttons: [
        { text: 'Start blank', handler: () => this.openEditor() },
        { text: 'Use preset', handler: () => this.openPresets() },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  openEditor(preset = null) {
    this.router.navigate(['/interview-evaluation-view', 'new'], {
      queryParams: { candidate_id: this.candidate_id },
      state: { preset }
    });
  }

  async openPresets() {
    const modal = await this.modalCtrl.create({
      component: EvaluationPresetModalComponent,
      cssClass: 'popup-modal'
    });
    modal.onDidDismiss().then(result => {
      if (result && result.data && result.data.preset) {
        this.openEditor(result.data.preset);
      }
    });
    await modal.present();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
