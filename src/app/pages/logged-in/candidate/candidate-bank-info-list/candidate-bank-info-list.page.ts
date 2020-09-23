import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import {TransferCandidate} from 'src/app/models/transfer-candidate';


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
  public transferCandidate: TransferCandidate[];

  public loading = false;
  public paginationLoading = false;

  public downloading = false;

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

      this.totalCount = response.headers.get('X-Pagination-Total-Count');
      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.transferCandidate = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * get candidate detail from transfer candidate record
   * @param transferCandidate
   */
  getCandidateDetail(transferCandidate) {
    return { store: transferCandidate.store, company: transferCandidate.company, ...transferCandidate.candidate };
  }

  /**
   * Loads the create page
   */
  create() {
    this.navCtrl.navigateForward('candidate-form');
  }

  doInfinite(event) {
    this.paginationLoading = true;

    this.currentPage ++;

    this.candidateService.listWithoutBank(this.searchBar, this.currentPage).subscribe(response => {

        this.paginationLoading = false;

        this.totalCount = response.headers.get('X-Pagination-Total-Count');
        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.transferCandidate = this.transferCandidate.concat(response.body);
      },
      error => { },
      () => { event.target.complete(); }
    );
  }
}

