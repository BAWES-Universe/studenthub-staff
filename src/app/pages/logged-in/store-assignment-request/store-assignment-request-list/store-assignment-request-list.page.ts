import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
//models
import { StoreAssignmentRequest } from 'src/app/models/store-assignment-request';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { StoreAssignmentRequestService } from 'src/app/providers/logged-in/store-assignment-request.service';


@Component({
  selector: 'app-store-assignment-request-list',
  templateUrl: './store-assignment-request-list.page.html',
  styleUrls: ['./store-assignment-request-list.page.scss'],
})
export class StoreAssignmentRequestListPage implements OnInit {

  public requests: StoreAssignmentRequest[] = [];

  public loading: boolean = false; 

  public processing: boolean = false; 
  
  public borderLimit = false;

  public totalCount = 0;
  public pageCount = 0;
  public currentPage = 1;

  constructor(
    public authService: AuthService,
    public alertCtrl: AlertController,
    public analyticsService: AnalyticsService,
    public sarSservice: StoreAssignmentRequestService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Store Assignment Request List Page');

    this.loadData();
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  loadData(silent = false) {
    if(!silent)
      this.loading = true; 

    this.currentPage = 1;
    this.pageCount = 0; 

    this.sarSservice.list(this.currentPage, "&expand=store,candidate").subscribe(res => {
      this.requests = res.body; 

      this.loading = false;
    }, () => {
      this.loading = false;
    })
  }
  
  /**
   * 
   * @param event 
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.sarSservice.list(this.currentPage, "&expand=store,candidate").subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = this.requests.concat(response.body);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  reject(event, request: StoreAssignmentRequest) {
    event.preventDefault();
    event.stopPropagation();

    this.processing = true; 

    this.sarSservice.reject(request.sar_uuid).subscribe(async res => {
      this.processing = false; 

      if(res.operation == "success") {
        request.status = 2;
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Oops',
          subHeader: this.authService.errorMessage(res.message),
          buttons: ['Okay']
        });
        alert.present();
      }
    }, () => {
      this.processing = false; 
    })
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) 
      return null;
    
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }
}
