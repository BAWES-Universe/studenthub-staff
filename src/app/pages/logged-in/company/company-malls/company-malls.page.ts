import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//servies
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { MallViewPage } from '../../mall/mall-view/mall-view.page';


@Component({
  selector: 'app-company-malls',
  templateUrl: './company-malls.page.html',
  styleUrls: ['./company-malls.page.scss'],
})
export class CompanyMallsPage implements OnInit {

  public company: Company;
  public loading= false;

  public borderLimit: boolean = false;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.companyService.view(this.company.company_id, 'stats,malls').subscribe(data => {
      this.loading = false;
      this.company = data;
    });
  }

  /**
   * open brand edit page
   * @param mall
   */
  async mallSelected(mall) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['mall-view', mall.mall_uuid], {
          state: {
            model: mall
          }
        });
      }, 100);
    });

    /*window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: MallViewPage,
      componentProps: {
        mall_uuid: mall.mall_uuid,
        mall: mall
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();*/
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
