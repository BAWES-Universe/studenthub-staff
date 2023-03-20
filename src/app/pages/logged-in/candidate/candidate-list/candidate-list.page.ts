import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { Story } from 'src/app/models/request';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
//pages
import { CandidateMergeSelectPage } from '../candidate-merge-select/candidate-merge-select.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';


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

  constructor(
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public candidateIdCardService: CandidateIdCardService,
    public eventService: EventService,
    public candidateService: CandidateService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {

    const state = window.history.state;

    if (state.story) {
      this.story = state.story;
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
      this.deselect();
    });
  }

  deselect() {
    this.candidateService.candidates = [];
    this.candidateIdCardService.candidates = [];

    this.eventService.clearCandidateSelection$.next({});
  }

  /**
   * Merge to account
   */
  async merge(e) {

    if (this.candidateService.candidates.length != 2) {
      const prompt = await this.alertCtrl.create({
        message: 'Please select any 2 candidates',
        buttons: ['Okay']
      });
      prompt.present();

      return false;
    }

    const popover = await this.popoverCtrl.create({
      component: CandidateMergeSelectPage,
      event: e,
      cssClass: 'candidate-merge-select'
    });

    popover.onDidDismiss().then(e => {

      if(!e.data || !e.data.candidate) {
        return false;
      }

      let source;

      if(e.data.candidate.candidate_id == this.candidateService.candidates[1].candidate_id) {
        source = this.candidateService.candidates[0].candidate_id;
      } else {
        source = this.candidateService.candidates[1].candidate_id;
      }

      this.merging = true;

      this.candidateService.merge(source, e.data.candidate.candidate_id).subscribe(response => {
      }, (err) => {
      }, () => {
        this.merging = false;
        this.deselect();
        this.loadData(this.currentPage);
      });
    });
    popover.present();
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
   * export id cards
   */
  async export() {
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
            const search = this.urlParams();
            this.candidateService.export(search).subscribe(response => {
              this.exporting = false;
            }, (err) => {
              this.exporting = false;
            }, () => {
              this.exporting = false;
              this.deselect();
            });
          }
        },
      ],
    });
    await alert.present();
  }
}

