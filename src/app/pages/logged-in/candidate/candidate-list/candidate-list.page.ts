import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';


@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.page.html',
  styleUrls: ['./candidate-list.page.scss'],
})
export class CandidateListPage implements OnInit {

  public pageCountAssign = 0;
  public pageCountUnAssign = 0;
  public currentPageAssign = 1;
  public currentPageUnAssign = 1;
  public totalCount = 0;
  public pages: number[] = [];

  public assignedSearchBar = '';
  public unassignedSearchBar = '';
  public cndSegment = 'assigned';
  public candidates: Candidate[];

  public loading: boolean = false;

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

  /**
   * Generate id cards
   */
  async generate() {

    if (this.candidateIdCardService.candidates.length == 0)
    {
      const prompt = await this.alertCtrl.create({
        message: 'Please select candidate(s)',
        buttons: ['Ok']
      });
      prompt.present();

      return false;
    }

    this.downloading = true;

    this.candidateIdCardService.generate(this.candidateIdCardService.candidates).subscribe(response => {
    }, (err) => {
    }, () => {
      this.downloading = false;
      this.candidateIdCardService.candidates = [];
    });
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
    this.candidateService.listNotAssigned(search, page).subscribe(response => {
      this.totalCount = response.headers.get('X-Pagination-Total-Count');
      this.pageCountUnAssign = response.headers.get('X-Pagination-Page-Count');
      this.currentPageUnAssign = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for (let i = 1; i <= this.pageCountUnAssign; i++) {
        this.pages.push(i);
      }

      // hide if no page = 1

      if (this.pageCountUnAssign == 1) {
        this.pages = [];
      }

      this.candidates = response.body;
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
    this.candidateService.listAssigned(search, page).subscribe(response => {

      this.totalCount = response.headers.get('X-Pagination-Total-Count');
      this.pageCountAssign = response.headers.get('X-Pagination-Page-Count');
      this.currentPageAssign = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for (let i = 1; i <= this.pageCountAssign; i++) {
        this.pages.push(i);
      }

      // hide if no page = 1

      if (this.pageCountAssign == 1) {
        this.pages = [];
      }

      this.candidates = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
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
    this.loading = true;
    if (type == 'assigned') {
     
      this.currentPageAssign ++;
      this.candidateService.listAssigned(this.assignedSearchBar, this.currentPageAssign).subscribe(response => {
          this.loading = false;
          this.totalCount = response.headers.get('X-Pagination-Total-Count');
          this.pageCountAssign = response.headers.get('X-Pagination-Page-Count');
          this.currentPageAssign = response.headers.get('X-Pagination-Current-Page');

          this.candidates = this.candidates.concat(response.body);
        },
        error => { },
        () => { event.target.complete(); }
      );
    } else {
      this.currentPageUnAssign ++;

      this.candidateService.listNotAssigned(this.unassignedSearchBar, this.currentPageUnAssign).subscribe(response => {
          this.loading = false;
          this.totalCount = response.headers.get('X-Pagination-Total-Count');
          this.pageCountUnAssign = response.headers.get('X-Pagination-Page-Count');
          this.currentPageUnAssign = response.headers.get('X-Pagination-Current-Page');
          this.candidates = this.candidates.concat(response.body);
        },
        error => { },
        () => { event.target.complete(); }
      );
    }


  }
}

