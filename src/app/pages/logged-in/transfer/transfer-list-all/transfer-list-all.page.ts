import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
// models
import { Transfer } from 'src/app/models/transfer';
import { AnalyticsService } from 'src/app/providers/analytics.service';
// services
import {TransferService} from "src/app/providers/logged-in/transfer.service";



@Component({
  selector: 'app-transfer-list-all',
  templateUrl: './transfer-list-all.page.html',
  styleUrls: ['./transfer-list-all.page.scss'],
})
export class TransferListAllPage implements OnInit {

  public transfers: Transfer[];

  public borderLimit: boolean = false;

  public loading: boolean = false;
  public downloading: boolean = false;
  public loadingMore: boolean = false;
  public pageCount;
  public currentPage;
  public start_date; // max date
  public end_date; // max date
  public type; // max date
  public totalCount = 1;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public transferService: TransferService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Transfer List Page');

    this.loadData(1);
  }

  loadData(page) {
    this.loading = true;
    const urlParams = this.getUrlParams();
    this.transferService.list(page, urlParams).subscribe(data => {
      this.transfers = data.body;
      this.pageCount = parseInt(data.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(data.headers.get('X-Pagination-Current-Page'), 10);
      this.totalCount = parseInt(data.headers.get('X-Pagination-Total-Count'), 10);

      this.loading = false;
    });
  }

  doInfinite(event) {
    this.loadingMore = true;

    this.currentPage++;
    const urlParams = this.getUrlParams();
    this.transferService.list(this.currentPage, urlParams).subscribe(data => {
        this.pageCount = parseInt(data.headers.get('X-Pagination-Page-Count'), 10);
        this.currentPage = parseInt(data.headers.get('X-Pagination-Current-Page'), 10);

        this.transfers = this.transfers.concat(data.body);
      },
      error => {
      },
      () => {
        this.loadingMore = false;
        event.target.complete();
      }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  clearSelection() {
    this.start_date = this.end_date = null;
    this.loadData(1);
  }

  export() {
    this.downloading = true;
    this.transferService.exportCompanyTransfer(this.getUrlParams()).subscribe(data => {
      this.downloading = false;
    });
  }

  getUrlParams() {
    let urlParams = 'expand=transferCandidates,transferCandidates.candidate,invoices,createdBy,updatedBy';

    if (this.start_date) {
      urlParams += '&start_date=' + this.start_date;
    }

    if (this.end_date) {
      urlParams += '&end_date=' + this.end_date;
    }

    if (this.type) {
      urlParams += `&transfer_status=${this.type}`;
    }

    return urlParams;
  }

  filterDate($event, type) {
    if (type == 'startDate') {
      this.start_date = format(parseISO($event.original), 'yyyy-MM-dd');
    } else {
      this.end_date = format(parseISO($event.original), 'yyyy-MM-dd');
    }
  }
}
