import { Component, OnInit } from '@angular/core';
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';


@Component({
  selector: 'app-company-request-dashboard',
  templateUrl: './company-request-dashboard.page.html',
  styleUrls: ['./company-request-dashboard.page.scss'],
})
export class CompanyRequestDashboardPage implements OnInit {

  public loading: boolean = false; 

  public borderLimit = false;

  public pendingRequests: Request[] = [];

  public myRequests: Request[] = [];

  public activeRequests: Request[] = [];

  constructor(
    public requestService: CompanyRequestService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    
    if(
      this.pendingRequests.length == 0 && 
      this.myRequests.length == 0 && 
      this.activeRequests.length == 0
    ) {
      this.loading = true; 
    }

    this.loadActiveRequests();
    this.loadPendingRequests();
    this.loadMyRequests();
  }

  loadActiveRequests() {
    this.requestService.listActiveRequests().subscribe(data => {
      this.activeRequests = data;
      this.loading = false; 
    });
  }

  loadPendingRequests() {
    this.requestService.listPendingRequests().subscribe(data => {
      this.pendingRequests = data;
      this.loading = false; 
    });
  }

  loadMyRequests() {
    this.requestService.listMyRequests().subscribe(data => {
      this.myRequests = data;
      this.loading = false; 
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
