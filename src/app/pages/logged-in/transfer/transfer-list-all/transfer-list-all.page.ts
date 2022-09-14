import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
// models
import { Transfer } from 'src/app/models/transfer';
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

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public transferService: TransferService
  ) { }

  ngOnInit() {
    window.analytics.page('Transfer List Page');

    this.loadData(1);
  }

  loadData(page) {
    this.loading = true;
    const urlParams = this.getUrlParams();
    this.transferService.list(page, urlParams).subscribe(data => {
      this.transfers = data.body;
      this.pageCount = parseInt(data.headers.get('X-Pagination-Page-Count'), 10);
      this.currentPage = parseInt(data.headers.get('X-Pagination-Current-Page'), 10);

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
      const date = new Date(this.start_date);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day   = date.getDate().toString().padStart(2, '0');
      urlParams += '&start_date=' + date.getUTCFullYear() + '-' + month + '-' + day;
    }

    if (this.end_date) {
      const date = new Date(this.end_date);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day   = date.getDate().toString().padStart(2, '0');
      urlParams += '&end_date=' + date.getUTCFullYear() + '-' + month + '-' + day;
    }

    if (this.type) {
      urlParams += `&transfer_status=${this.type}`;
    }

    return urlParams;
  }
}
