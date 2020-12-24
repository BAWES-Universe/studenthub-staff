import { Component, OnInit } from '@angular/core';
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-company-request-dashboard',
  templateUrl: './company-request-dashboard.page.html',
  styleUrls: ['./company-request-dashboard.page.scss'],
})
export class CompanyRequestDashboardPage implements OnInit {

  public loading: boolean = false;

  public borderLimit = false;

  public activeRequests: Request[] = [];

  constructor(
    public requestService: CompanyRequestService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

    if(
      this.activeRequests.length == 0
    ) {
      this.loading = true;
    }

    this.loadActiveRequests();
  }

  /**
   * load active request I'm not handling
   */
  loadActiveRequests() {
    this.requestService.listActiveRequests().subscribe(data => {
      this.activeRequests = data;
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-dashboard'
      }
    });
  }
}
