import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import {TransferCandidate} from "../../../../models/transfer-candidate";


@Component({
  selector: 'app-candidate-bank-info-list',
  templateUrl: './candidate-bank-info-list.page.html',
  styleUrls: ['./candidate-bank-info-list.page.scss'],
})
export class CandidateBankInfoListPage implements OnInit {

  public pageCountAssign = 0;
  public pageCountUnAssign = 0;
  public currentPageAssign = 1;
  public currentPageUnAssign = 1;
  public totalCount = 0;

  public assignedSearchBar = '';
  public unassignedSearchBar = '';
  public cndSegment = 'assigned';
  public transferCandidate: TransferCandidate[];

  public loading: boolean = false;
  public paginationLoading = false;

  public downloading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
    // to open specific tab
    const segment = this.activatedRoute.snapshot.paramMap.get('segment');
    if (segment) {
      this.cndSegment = segment;
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData(this.currentPageAssign);
  }

  search() {
    this.currentPageAssign = 1;
    this.loadData(this.currentPageAssign);
  }

  loadData(page: number) {
    if (this.cndSegment == 'not-assigned') {
      this.loadNotAssigned(page, this.unassignedSearchBar);
    } else {
      this.loadAssigned(page, this.assignedSearchBar);
    }
  }

  /**
   * load unassigned data
   * @param page
   * @param search
   */
  async loadNotAssigned(page: number, search: string) {

    this.currentPageUnAssign = page;

    // Load list of candidates
    this.loading = true;
    this.candidateService.listNotAssignedWithoutBank(search, page, 0, 1).subscribe(response => {
      this.totalCount = response.headers.get('X-Pagination-Total-Count');
      this.pageCountUnAssign = response.headers.get('X-Pagination-Page-Count');
      this.currentPageUnAssign = response.headers.get('X-Pagination-Current-Page');

      this.transferCandidate = response.body;
    },
      error => { },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * load assigned user data
   * @param page
   * @param search
   */
  async loadAssigned(page: number, search: string) {

    this.currentPageAssign = page;

    // Load list of candidates
    this.loading = true;
    this.candidateService.listAssignedWithoutBank(search, page, 0, 1).subscribe(response => {

      this.totalCount = response.headers.get('X-Pagination-Total-Count');
      this.pageCountAssign = response.headers.get('X-Pagination-Page-Count');
      this.currentPageAssign = response.headers.get('X-Pagination-Current-Page');

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

  pageLinkColor(page: number) {

    if (page == this.currentPageAssign) {
      return 'light';
    }

    return '';
  }

  /**
   * Loads the create page
   */
  create() {
    this.navCtrl.navigateForward('candidate-form');
  }

  loadSegment($event) {
    this.cndSegment = $event.detail.value;
    if ($event.detail.value == 'assigned') {
      this.loadAssigned(1, this.assignedSearchBar);
    } else if ($event.detail.value == 'not-assigned') {
      this.loadNotAssigned(1, this.unassignedSearchBar);
    }
  }

  doInfinite(event, type) {
    this.paginationLoading = true;
    if (type == 'assigned') {

      this.currentPageAssign ++;
      this.candidateService.listAssignedWithoutBank(this.assignedSearchBar, this.currentPageAssign, 0, 1).subscribe(response => {
          this.paginationLoading = false;
          this.totalCount = response.headers.get('X-Pagination-Total-Count');
          this.pageCountAssign = response.headers.get('X-Pagination-Page-Count');
          this.currentPageAssign = response.headers.get('X-Pagination-Current-Page');

          this.transferCandidate = this.transferCandidate.concat(response.body);
        },
        error => { },
        () => { event.target.complete(); }
      );
    } else {
      this.currentPageUnAssign ++;

      this.candidateService.listNotAssignedWithoutBank(this.unassignedSearchBar, this.currentPageUnAssign, 0, 1).subscribe(response => {
          this.paginationLoading = false;
          this.totalCount = response.headers.get('X-Pagination-Total-Count');
          this.pageCountUnAssign = response.headers.get('X-Pagination-Page-Count');
          this.currentPageUnAssign = response.headers.get('X-Pagination-Current-Page');
          this.transferCandidate = this.transferCandidate.concat(response.body);
        },
        error => { },
        () => { event.target.complete(); }
      );
    }


  }
}

