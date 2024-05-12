import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
//models
import { Candidate } from 'src/app/models/candidate';
import { RequestInterview } from 'src/app/models/request-interview';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { RequestInterviewFilterPage } from '../request-interview-filter/request-interview-filter.page';


@Component({
  selector: 'app-request-interview-list',
  templateUrl: './request-interview-list.page.html',
  styleUrls: ['./request-interview-list.page.scss'],
})
export class RequestInterviewListPage implements OnInit {

  public requestInterviews: RequestInterview[] = [];

  public loading: boolean = false; 

  public pageCount = 0;

  public currentPage: any = 1;

  public totalCount = 0;

  public company;
  
  public borderLimit = false;

  public filters = {
    application_uuid: null,//'9' for unstarted
    request_uuid: null,//'started',
    fulltimer_uuid: null,
    candidate_id: null,
    staff_id: null,
    from: null,
    to: null,
    status: null,
  };

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public requestService: CompanyRequestService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

    const state = window.history.state;

    if(state && state.status) {
      this.filters.status = state.status;
    }

    this.loadData();
  }

  loadData() {

    this.loading = true;

    this.requestService.listInterviewRequests(1, this.getUrlParams()).subscribe(response => {
      this.loading = false;

      this.requestInterviews = response.body; 

      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

    }, () => {
      this.loading = false;
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {
 
    this.loading = true;

    this.currentPage++;

    this.requestService.listInterviewRequests(this.currentPage, this.getUrlParams()).subscribe(response => {

      this.loading = false;

      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requestInterviews = this.requestInterviews.concat(response.body);
    },
      () => { },
      () => { event.target.complete(); }
    );
  }

  getUrlParams() {
  
    let urlParams = '';

    if (this.filters.application_uuid) {
      urlParams += '&application_uuid=' + this.filters.application_uuid;
    }
    
    if (this.filters.request_uuid) {
      urlParams += '&request_uuid=' + this.filters.request_uuid;
    }
    
    if (this.filters.fulltimer_uuid) {
      urlParams += '&fulltimer_uuid=' + this.filters.fulltimer_uuid;
    }

    if (this.filters.candidate_id) {
      urlParams += '&candidate_id=' + this.filters.candidate_id;
    }
    
    if (this.filters.staff_id) {
      urlParams += '&staff_id=' + this.filters.staff_id;
    }

    if (this.filters.from) {
      urlParams += '&from=' + this.filters.from;
    }

    if (this.filters.to) {
      urlParams += '&to=' + this.filters.to;
    }

    if (this.filters.status) {
      urlParams += '&status=' + this.filters.status;
    }

    return urlParams;
  }

  /**
   * On candidate selected from list
   */
  candidateSelected(candidate: Candidate) {
    this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
      state: {
        model: candidate
      }
    });
  }

  /**
   * open filter
   * @returns
   */
  async openFilter() {

    const modal = await this.modalCtrl.create({
      component: RequestInterviewFilterPage,
      cssClass: 'modal-request-filter',
      componentProps: {
        filters: Object.assign({}, this.filters)
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data && (
        data.application_uuid != this.filters.application_uuid ||
        data.request_uuid != this.filters.request_uuid ||
        data.fulltimer_uuid != this.filters.fulltimer_uuid ||
        data.candidate_id != this.filters.candidate_id ||
        data.staff_id != this.filters.staff_id ||
        data.from != this.filters.from ||
        data.to != this.filters.to ||
        data.status != this.filters.status
    )) {
      this.filters = data;
      this.loadData();
    } 
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
