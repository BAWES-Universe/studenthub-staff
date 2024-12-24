import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppealFilterComponent } from 'src/app/components/appeal-filter/appeal-filter.component';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-appeal-list',
  templateUrl: './appeal-list.page.html',
  styleUrls: ['./appeal-list.page.scss'],
})
export class AppealListPage implements OnInit {

  public loading = false;

  public filter: {
    status: number | undefined,
    from: string| undefined,
    to: string| undefined
  } = {
    status: undefined,
    from: undefined,
    to: undefined
  };

  public currentPage: number = 1;

  public pageCount: number;

  public query = '';

  public appeals: any[] = [];

  public borderLimit;

  constructor(
    public modalCtrl: ModalController,
    public analyticService: AnalyticsService,
    public translateService: TranslateLabelService,
    public candidateWorkingHourService: CandidateWorkingHourService    
  ) { }

  ngOnInit() {
    this.analyticService.page('Company Contact List Page');
    
    const state = window.history.state;

    if (state) {
      this.filter = state;
    }

    this.loadData();

    /*if (!this.company) {
      this.loadCompanyDetail();
    }*/
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  /**
   * open filter
   * @returns
   */
  async openFilter() {

    const modal = await this.modalCtrl.create({
      component: AppealFilterComponent,
      cssClass: 'modal-request-filter',
      componentProps: {
        filters: Object.assign({}, this.filter),
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data && (data.from != this.filter.from || data.to != this.filter.to || data.status != this.filter.status)) {
      this.filter = data;
      this.loadData();
    }
  }

  clearFilter() {
    this.filter = {
      status: undefined,
      from: undefined,
      to: undefined
    };
    this.loadData();
  }

  /**
   * retrun url params for filter
   * @returns 
   */
  getUrlParams() {
    let url = "&q="+ this.query;

    if([10, 1, 2, 3].includes(this.filter.status)) {
      url += '&status=' + this.filter.status;
    }

    if(this.filter.to) {
      url += '&to=' + this.filter.to;
    }

    if(this.filter.from) {
      url += '&from=' + this.filter.from;
    }
  
    return url;
  }

  /**
   * load  
   */
  loadData() {
    
    this.loading = true;

    const urlParams = this.getUrlParams();
 
    this.candidateWorkingHourService.listAppeal(this.currentPage, urlParams).subscribe(response => {
      this.loading = false;
      this.appeals = response.body;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    });
  }


  /**
   * infinite loader on scroll
   * @param event
   */
  doInfinite(event) {

    if(this.currentPage == this.pageCount) {
      event.target.complete();
      return null;
    }

    this.loading = true;

    this.currentPage++;

    const urlParams = this.getUrlParams();
 
    this.candidateWorkingHourService.listAppeal(this.currentPage, urlParams).subscribe(response => {
      this.loading = false;
      this.appeals = response.body;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    });
  }

  secondsToTime(secs){
    var h = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var m = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var s = Math.ceil(divisor_for_seconds);

    return `${h?`${h}:`:""}${m?`${m}:${s}`:`${s}`}`
  }

  logScrolling(e) {
  }
}
