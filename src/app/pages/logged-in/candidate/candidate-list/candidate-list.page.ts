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

  public pageCount = 0;
  public currentPage: any = 1;
  public totalCount = 0;
  public pages: number[] = [];

  public filters: {
    name: string,
    email: string,
    phone: number,
    type: string
  } = {
      name: null,
      email: null,
      phone: null,
      type: null
    };
  public searchName = null;
  public searchEmail = null;
  public searchPhone = null;
  public searchType = null;

  public assignedSearchBar = '';
  public unassignedSearchBar = '';
  public cndSegment = 'assigned';
  public candidates: Candidate[];

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

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';

    if (this.filters.name) {
      urlParams += '&name=' + this.filters.name;
    }

    if (this.filters.email) {
      urlParams += '&email=' + this.filters.email;
    }

    if (this.filters.phone) {
      urlParams += '&phone=' + this.filters.phone;
    }

    if (this.filters.type) {
      urlParams += '&type=' + this.filters.type;
    }

    return urlParams;
  }

  /**
   * Reset question filter
   */
  resetFilter() {
    this.filters = {
      name: null,
      email: null,
      phone: null,
      type: null
    };
    this.loadData(1); // reload all result
  }
  /**
   * Generate id cards
   */
  async generate() {

    if (this.candidateIdCardService.candidates.length == 0) {
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
    this.loadData(1);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    const search = this.urlParams();
    this.currentPage = page;

    // Load list of candidates
    this.loading = true;
    this.candidateService.listFilter(search, page).subscribe(response => {

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
   * Loads the create page
   */
  create() {
    this.navCtrl.navigateForward('candidate-form');
  }


  doInfinite(event) {
    
    const search = this.urlParams();
    
    this.paginationLoading = true;
    
    this.currentPage++;

    this.candidateService.listFilter(search, this.currentPage).subscribe(response => {

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
}

