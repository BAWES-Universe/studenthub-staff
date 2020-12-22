import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
import { Transfer } from 'src/app/models/transfer';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
//pages
import { ImportTransferFormPage } from '../import-transfer-form/import-transfer-form.page';
import { TransferFormPage } from '../transfer-form/transfer-form.page';


@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.page.html',
  styleUrls: ['./transfer-list.page.scss'],
})
export class TransferListPage implements OnInit {

  public company: Company;
  
  public borderLimit: boolean = false;

  public loading: boolean = false; 

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public companyService: CompanyService
  ) { }

  ngOnInit() {

    if(!this.company) {
      this.loadData();
    }
  }
  
  loadData() {
    this.loading = true;

    this.companyService.view(this.company.company_id).subscribe(data => {
      this.company = data;

      this.loading = false;
    });
  }

  async openTransferDetailPage(transfer) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['transfer-view', transfer.transfer_id], {
          state: {
            model: transfer
          }
        });
      }, 100);
    });
    /*
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: TransferViewPage,
      componentProps: {
        transfer: transfer,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();*/
  }  

  /**
   * Present action sheet to create a new transfer
   */
  async presentActionSheetForNewTransfer() {
    const actionSheet = await this.alertCtrl.create({
      header: 'How do you wish to create your transfer?',
      buttons: [
        {
          text: 'Manual input of hours',
          handler: () => {
            this.createNewTransfer();
          }
        },
        {
          text: 'Excel sheet upload',
          handler: () => {
            this.importTransfer();
          }
        }
      ]
    });

    actionSheet.present();
  }

  /**
   * Loads form to initiate a new transfer
   */
  async createNewTransfer() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
    
    let transfer = new Transfer;
    transfer.company_id = this.company.company_id;

    const modal = await this.modalCtrl.create({
      component: TransferFormPage,
      componentProps: {
        transfer: transfer
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();
  }

  /**
   * Loads form to initiate a new transfer
   */
  async importTransfer() {
    
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let transfer = new Transfer;
    transfer.company_id = this.company.company_id;

    const modal = await this.modalCtrl.create({
      component: ImportTransferFormPage,
      componentProps: {
        transfer: transfer,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadData();
      }
    });
    modal.present();
  }
  
  dismiss() {
    this.modalCtrl.dismiss();
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
