import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-assigned-idle-candidates',
  templateUrl: './assigned-idle-candidates.page.html',
  styleUrls: ['./assigned-idle-candidates.page.scss'],
})
export class AssignedIdleCandidatesPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public pages: number[] = [];

  public SearchBar = '';
  public candidates: Candidate[];

  public loading: boolean = false;
  public paginationLoading = false;
  public downloading: boolean = false;
  public exporting: boolean = false;

  public borderLimit = false;

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
    public analyticService: AnalyticsService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Assigned Idle Candidates Page');
  }

  ionViewWillEnter() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    this.loadAssigned(page, this.SearchBar);
  }

  /**
   * load assigned user data
   * @param page
   * @param search
   */
  async loadAssigned(page: number, search: string) {

    this.currentPage = page;

    // Load list of candidates
    this.loading = true;

    this.candidateService.assignedIdleCandidate(search, page).subscribe(response => {

      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidates = response.body;
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  doInfinite(event) {

    this.paginationLoading = true;

    this.currentPage ++;

    this.candidateService.assignedIdleCandidate(this.SearchBar, this.currentPage).subscribe(response => {

        this.paginationLoading = false;
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.candidates = this.candidates.concat(response.body);
      },
      error => { },
      () => { event.target.complete(); }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * export id cards
   */
  async exportData() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to export the file?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Yes',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            this.exporting = true;
            this.candidateService.export('&task=assigned_idle', 1, 'assigned-idle-candidates.xlsx').subscribe(response => {
              this.exporting = false;
            }, (err) => {
              this.exporting = false;
            }, () => {
              this.exporting = false;
            });
          }
        },
      ],
    });
    await alert.present();
  }
}

