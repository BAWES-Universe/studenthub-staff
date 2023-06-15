import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
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
import {CandidateWorkHistory} from "../../../../models/candidate-work-history";
import {TranslateLabelService} from "../../../../providers/translate-label.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-candidate-assigned-history',
  templateUrl: './candidate-assigned-history.page.html',
  styleUrls: ['./candidate-assigned-history.page.scss'],
})
export class CandidateAssignedHistoryPage implements OnInit {

  public pageCount = 0;

  public currentPage: any = 1;

  public totalCount = 0;

  public pages: number[] = [];

  public filters: {
    name: string,
    email: string,
    phone: number,
    start_date: string,
    end_date: string,
    working_time: number,
    sameRate: boolean,
    page: number
  } = {
      name: null,
      email: null,
      phone: null,
      start_date: null,
      end_date: null,
      working_time: null,
      sameRate: null,
      page: 1
    };

  public searchName = null;
  public searchEmail = null;
  public searchPhone = null;
  public searchType = null;

  public assignedSearchBar = '';
  public unassignedSearchBar = '';
  public cndSegment = 'assigned';
  public candidates: CandidateWorkHistory[];

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
    public translateService: TranslateLabelService,
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

    if (this.filters.start_date) {
      urlParams += '&start_date=' + format(parseISO(this.filters.start_date), 'yyyy-MM-dd');
    }

    if (this.filters.end_date) {
      urlParams += '&end_date=' + format(parseISO(this.filters.end_date), 'yyyy-MM-dd');
    }

    if (this.filters.page) {
      urlParams += '&export_page=' + this.filters.page;
    }

    if (this.filters.working_time) {
      urlParams += '&working_time=' + this.filters.working_time;
    }
    
    if (this.filters.sameRate) {
      urlParams += '&filterSameRate=' + this.filters.sameRate;
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
      start_date: null,
      working_time: null,
      end_date: null,
      sameRate: null,
      page: 1
    };
    this.loadData(1); // reload all result
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

    this.candidateService.listAssignHistoryList(search, page).subscribe(response => {

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

    this.candidateService.listAssignHistoryList(search, this.currentPage).subscribe(response => {

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
            this.candidateService.exportAssigned(search).subscribe(response => {
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

  filterDate($event, type) {
    if (type == 'startDate') {
      this.filters.start_date = format(parseISO($event.original), 'yyyy-MM-dd');
    } else {
      this.filters.end_date = format(parseISO($event.original), 'yyyy-MM-dd');
    }
  }
}

