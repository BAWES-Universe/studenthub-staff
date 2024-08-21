import { Component, OnInit } from '@angular/core';
//models
import { ComapanyRequest } from 'src/app/models/company.request';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CompanyRegistrationRequestService } from 'src/app/providers/logged-in/company-registration-request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CompanyRegistrationRequestViewPageModule } from '../company-registration-request-view/company-registration-request-view.module';
import { CompanyRegistrationRequestViewPage } from '../company-registration-request-view/company-registration-request-view.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-company-registration-request-list',
  templateUrl: './company-registration-request-list.page.html',
  styleUrls: ['./company-registration-request-list.page.scss'],
})
export class CompanyRegistrationRequestListPage implements OnInit {
 
  public loading = false;
  public borderLimit = false;
  public deleting = false;

  public totalCount = 0;
  public pageCount = 0;
  public currentPage = 1;
  public totalStudents = 0;
  public requests: ComapanyRequest[];

  constructor(   
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public registrationRequestService: CompanyRegistrationRequestService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Registration Request List Page');

    this.loadData(this.currentPage);
  }
 
  async viewRequest(request) {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyRegistrationRequestViewPage,
      componentProps: {
        request: request,
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadData(1);
    }
  }

  handleRefresh(event) {
    this.loadData(1, true, event);
  }

  /**
   * list banks
   * @param page
   */
  async loadData(page: number, silent = false, event = null) {

    if (!silent) {
      this.loading = true;
    }

    this.registrationRequestService.list(page).subscribe(response => {

      this.loading = false;
      this.deleting = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.requests = response.body;
 
      if(event)
        event.target.complete();

    }, () => {
      this.loading = false;
      this.deleting = false;
    });
  }

  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.registrationRequestService.list(this.currentPage).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = this.requests.concat(response.body);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

}
