import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { Candidate } from 'src/app/models/candidate';
import { Company } from 'src/app/models/company';
import { Story } from 'src/app/models/request';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'app-company-candidates',
  templateUrl: './company-candidates.page.html',
  styleUrls: ['./company-candidates.page.scss'],
})
export class CompanyCandidatesPage implements OnInit {

  public pageCount = 0;

  public currentPage: any = 1;

  public totalCount = 0;

  public pages: number[] = [];

  public filters: {
    name: string,
    email: string,
    phone: number,
    civil: number,
    civilId: number,
    type: string,
    page: number
  } = {
      name: null,
      email: null,
      phone: null,
      type: null,
      civil: null,
      civilId: null,
      page: 1
    };

  public searchName = null;
  public searchEmail = null;
  public searchPhone = null;
  public searchType = null;

  public assignedSearchBar = '';
  public unassignedSearchBar = '';
  public cndSegment = 'assigned';
  public candidates: Candidate[];

  public loading: boolean = false;
  
  public paginationLoading: boolean = false;

  public downloading: boolean = false;
  public merging: boolean = false;
  public exporting: boolean = false;

  public borderLimit = false;

  public story: Story;

  public company: Company;

  constructor(
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public modalCtrl: ModalController,
    public candidateService: CandidateService,
    public analyticService: AnalyticsService
  ) { }
  

  ngOnInit() {

    const state = window.history.state;

    if (state.story) {
      this.story = state.story;
    }
    
    if (state.company) {
      this.company = state.company;
    }

    this.analyticService.page('Candidate List Page');

    this.loadData(1);
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
    if (this.filters.page) {
      urlParams += '&export_page=' + this.filters.page;
    }
    if (this.filters.civil) {
      urlParams += '&civil=' + this.filters.civil;
    }
    if (this.filters.civilId) {
      urlParams += '&civilId=' + this.filters.civilId;
    }

    if(this.company) {
      urlParams += '&company_id=' + this.company.company_id;
    }

    urlParams += '&export_limit=5000';

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
      civil: null,
      civilId: null,
      type: null,
      page: 1
    };
    this.loadData(1); // reload all result
  }
 
  ionViewWillEnter() {
    // this.loadData(1);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  /**
   * Load list of candidates
   * @param page
   */
  loadData(page: number) {
    const search = this.urlParams();
    this.currentPage = page;

    this.loading = true;

    this.candidates = [];

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
   * load more on scroll to bottom
   * @param event
   */
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

  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model: model,
        story: this.story
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
 
  /**
   * close page
   */
  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        this.modalCtrl.dismiss();
      }
    });
  }

  /**
   * On candidate selected from list
   */
  candidateSelected(candidate: Candidate) {

    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss();
      }
    });

    this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
      state: {
        model: candidate
      }
    });
  }
}
