
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//models
import { Store } from 'src/app/models/store';
import { Company } from '../../../../models/company';
//services
import { StoreService } from 'src/app/providers/logged-in/store.service';


@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  public pageCount = 0;

  public currentPage = 1;

  public loading = false;

  public stores: Store[];

  public company: Company;

  public borderLimit = false;

  constructor(
    public storeService: StoreService,
    private modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * load store list
   * @param page
   */
  async loadData(page: number) {

    this.loading = true;

    this.storeService.list('store_id', 'storeWithCompany').subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.stores = response.body;
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.dismiss(model);
  }

  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.storeService.list('store_id', 'storeWithCompany').subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.stores = this.stores.concat(response.body);
    },
      error => {
      },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
