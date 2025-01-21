import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdRequestService } from 'src/app/providers/logged-in/candidate-id-request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-candidate-id-request-list',
  templateUrl: './candidate-id-request-list.page.html',
  styleUrls: ['./candidate-id-request-list.page.scss'],
})
export class CandidateIdRequestListPage implements OnInit {

  public pageCount;
  public currentPage;
  public totalCount;

  public borderLimit: boolean = false;
  public loading: boolean = false;
  public models: any[] = [];

  constructor(
    public awsService: AwsService,
    public translateService: TranslateLabelService,
    public candidateIdRequestService: CandidateIdRequestService,
    public analyticService: AnalyticsService,
    public router: Router,
  ) { }


  ngOnInit() {
    this.analyticService.page('ID Request List Page');
 
    this.loadData();
  } 

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  loadData() {
    this.loading = true;

    this.candidateIdRequestService.list(this.currentPage).subscribe(data => {
      this.models = data.body;
      this.pageCount = parseInt(data.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(data.headers.get('X-Pagination-Current-Page'), 10);
      this.totalCount = parseInt(data.headers.get('X-Pagination-Total-Count'), 10);

      this.loading = false;
    });
  }


  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.candidateIdRequestService.list(this.currentPage).subscribe(data => {
        this.pageCount = parseInt(data.headers.get('X-Pagination-Page-Count'), 10);
        this.currentPage = parseInt(data.headers.get('X-Pagination-Current-Page'), 10);

        this.models = this.models.concat(data.body);
      },
      error => {
      },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onLinkClick(event) {
    event.stopPropagation();
  }
}
