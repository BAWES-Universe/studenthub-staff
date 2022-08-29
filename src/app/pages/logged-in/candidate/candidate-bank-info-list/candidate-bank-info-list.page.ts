import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
// models
import {Candidate} from 'src/app/models/candidate';


@Component({
  selector: 'app-candidate-bank-info-list',
  templateUrl: './candidate-bank-info-list.page.html',
  styleUrls: ['./candidate-bank-info-list.page.scss'],
})
export class CandidateBankInfoListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public searchBar = '';
  public candidates: Candidate[];

  public loading = false;
  public exporting = false;
  public paginationLoading = false;

  public downloading = false;

  public borderLimit = false;

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
  }

  ngOnInit() {
    window.analytics.page('Candidate Bank Info List Page');
  }

  ionViewWillEnter() {
    this.loadData(0);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    this.loadAssigned(page, this.searchBar);
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

    this.candidateService.listWithoutBank(search, page).subscribe(response => {

      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidates = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * get candidate detail from transfer candidate record
   * @param transferCandidate
   */
  // getCandidateDetail(transferCandidate) {
  //   return { store: transferCandidate.store, company: transferCandidate.company, ...transferCandidate.candidate };
  // }

  /**
   * Loads the create page
   */
  create() {
    this.navCtrl.navigateForward('candidate-form');
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {
    this.paginationLoading = true;

    this.currentPage++;

    this.candidateService.listWithoutBank(this.searchBar, this.currentPage).subscribe(response => {

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
            this.candidateService.export('&task=missing_bank_info', 1, 'missing-bank-info-candidates.xlsx').subscribe(response => {
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

