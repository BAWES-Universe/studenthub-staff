import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';
import { InterviewEvaluationFormPage } from '../interview-evaluation-form/interview-evaluation-form.page';

@Component({
  selector: 'app-interview-evaluation-list',
  templateUrl: './interview-evaluation-list.page.html',
  styleUrls: ['./interview-evaluation-list.page.scss'],
})
export class InterviewEvaluationListPage implements OnInit {

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

    this.loadInterviews();
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
      this.navCtrl.navigateForward("/interview-evaluation-view/" + interviewEvaluation.interview_evaluation_uuid);
   // });
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: InterviewEvaluationFormPage,
      componentProps: {
        candidate_id: this.candidate_id
      },
      cssClass: "popup-modal"
    });
    modal.onDidDismiss().then(e => {

      if (e && e.data && e.data.refresh) {
        this.loadInterviews();
      }
    });
    modal.present();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
