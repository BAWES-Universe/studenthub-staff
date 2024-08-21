import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { CandidateWarning } from 'src/app/models/candidate-warning';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
//pages
import { CandidateWarningFormPage } from '../candidate-warning-form/candidate-warning-form.page';


@Component({
  selector: 'app-candidate-warnings',
  templateUrl: './candidate-warning-list.page.html',
  styleUrls: ['./candidate-warning-list.page.scss'],
})
export class CandidateWarningsPage implements OnInit {

  public borderLimit;

  public loading: boolean = false;

  public candidate_id;

  public candidate;

  public warnings: CandidateWarning[] = [];
  
  public pageCount = 0;
  
  public currentPage = 1;

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
    public analyticService: AnalyticsService
  ) {
  }
  
    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
      if (!date) 
      return null;
      
      if (date) {
      return new Date(date.replace(/-/g, '/'));
      }
  }

  ngOnInit() {
    this.analyticService.page('Candidate Warnings Page');

    if(!this.candidate_id)
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');

    const state = window.history.state;

    if(state && state.candidate) {
      this.candidate = state.candidate;
    }

    if(!this.candidate) {
      this.loadCandidateDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.eventService.warningUpdated$.subscribe((data: any) => {
      if (data.candidate_id == this.candidate_id) {
        this.loadWarnings();
      }
    });

    this.loadWarnings();
  }

  loadCandidateDetail(loading = true) {
    this.loading = loading;

    this.candidateService.detail(this.candidate_id).subscribe(response => {

      this.loading = false;
      this.candidate = response;
    });
  }

  /**
   * load candidate warnings without pagination
   */
  loadWarnings() { 
    this.candidateService.candidateWarnings(this.candidate_id, 1).subscribe(async response => {
      this.warnings = response.body;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    });
  }


  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.candidateService.candidateWarnings(this.candidate_id, this.currentPage).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.warnings = this.warnings.concat(response.body);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  /**
   * open popup to update modal
   */
  async add() {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    let warning = new CandidateWarning;
    warning.candidate_id = this.candidate_id;

    const modal = await this.modalCtrl.create({
      component: CandidateWarningFormPage,
      componentProps: {
        warning,
        candidate: this.candidate
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

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadWarnings();

      this.eventService.warningUpdated$.next({
        candidate_id: this.candidate_id
      });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
