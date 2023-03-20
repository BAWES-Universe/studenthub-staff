import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// services
import { BankService } from 'src/app/providers/logged-in/bank.service';
import { AuthService } from 'src/app/providers/auth.service';
// models
import { Bank } from 'src/app/models/bank';
import { AnalyticsService } from 'src/app/providers/analytics.service';



@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.page.html',
  styleUrls: ['./bank-list.page.scss'],
})
export class BankListPage implements OnInit {

  public loading = false;
  public borderLimit = false;
  public deleting = false;

  public totalCount = 0;
  public pageCount = 0;
  public currentPage = 1;
  public totalStudents = 0;
  public banks: Bank[];

  constructor(
    public platform: Platform,
    public router: Router,
    public bankService: BankService,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    public authService: AuthService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Bank List Page');

    this.loadData(this.currentPage);
  }

  /**
   * list banks
   * @param page
   */
  async loadData(page: number, silent = false) {

    if (!silent) {
      this.loading = true;
    }

    this.bankService.list(page).subscribe(response => {

      this.loading = false;
      this.deleting = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.banks = response.body;
      for (const bank of this.banks) {
        this.totalStudents += parseInt(bank.candidateCount);
      }
    }, () => {
      this.loading = false;
      this.deleting = false;
    });
  }

  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.bankService.list(this.currentPage).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.banks = this.banks.concat(response.body);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
