import { Component, OnInit, ViewChild } from '@angular/core';
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import {IonContent, NavController} from "@ionic/angular";
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-company-request-dashboard',
  templateUrl: './company-request-dashboard.page.html',
  styleUrls: ['./company-request-dashboard.page.scss'],
})
export class CompanyRequestDashboardPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading: boolean = false;

  public borderLimit = false;

  public activeRequests: Request[] = [];

  public scrollPosition = 0;

  constructor(
    public requestService: CompanyRequestService,
    public eventService: EventService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadActiveRequests();

    this.eventService.companyRequestUpdate$.subscribe(() => { 
      this.loadActiveRequests();
    });
  }

  ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
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

  /**
   * open request detail page
   * @param request 
   */
  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-dashboard'
      }
    });
  }
}
