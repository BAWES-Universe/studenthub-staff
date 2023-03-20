import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, ModalController, NavController, ToastController } from "@ionic/angular";
//models
import { Transfer } from "src/app/models/transfer";
import { Invoice } from "src/app/models/invoice";
//service
import { TransferService } from "src/app/providers/logged-in/transfer.service";
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
//pages
import { TransferFormPage } from '../transfer-form/transfer-form.page';
import { ImportTransferFormPage } from '../import-transfer-form/import-transfer-form.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-transfer-view',
  templateUrl: './transfer-view.page.html',
  styleUrls: ['./transfer-view.page.scss'],
})
export class TransferViewPage implements OnInit {

  public transfer: Transfer;
  public invoices: Invoice[] = []; // unpaid invoices
  public receipts: Invoice[] = []; // paid invoices
  public loading = false;
  public viewOnly = null;

  public transferStatus = '';
  public transferStatusDescription = '';

  public transfer_id;

  public segment = 'details';

  public borderLimit: boolean = false;

  constructor(
    public navCtrl: NavController,
    public aws: AwsService,
    public transferService: TransferService,
    public eventService: EventService,
    public analyticService: AnalyticsService,
    private _loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public _toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Transfer View Page');

    this.transfer_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.viewOnly = this.activatedRoute.snapshot.paramMap.get('view');

    this.loadData();
  }

  ionViewWillEnter() {
    if (history.state && history.state.refresh) {
      this.loadData();
    }
  }

  async loadData() {
    // Load list of transfer
    this.loading = true;

    this.transferService.transferIdDetails(this.transfer_id).subscribe(response => {

      this.transfer = response;

      this._updateTransferStatus();

      this.receipts = [];
      this.invoices = [];

      response.invoices.forEach((value, index) => {
        if (value.invoice_status == 'paid') {
          this.receipts.push(value);
        } else {
          this.invoices.push(value);
        }
      });

      this.loading = false;
    });
  }

  /**
   * Update transfer status and description based on return value from API
   */
  private _updateTransferStatus() {
    switch (this.transfer.transfer_status) {
      case 10: // Draft
        this.transferStatus = 'Transfer Draft';
        this.transferStatusDescription = '\'Lock Transfer\' once you are done inputting hours worked by your assigned employees. Invoices will be sent to you after lock.';
        break;
      case 5: // Transfer Locked
        this.transferStatus = 'Waiting for your payment';
        this.transferStatusDescription = 'Invoices for this transfer have been sent to you and are available for download below.';
        break;
      case 1: // Payment Sent
        this.transferStatus = 'Payment Sent';
        this.transferStatusDescription = 'Waiting for bank to verify payment received to start distribution of payment.';
        break;
      case 3: // Distribution in Progress
        this.transferStatus = 'Distribution in Progress';
        this.transferStatusDescription = 'Your payment has been received and is currently being distributed to your assigned employees.';
        break;
      case 4: // Transfer Complete
        this.transferStatus = 'Transfer Complete';
        this.transferStatusDescription = 'All done!';
        break;
    }
  }

  /**
   * Transfer Locking
   */
  async transferLock(transfer: Transfer) {
    // Load list of transfer
    const alert = await this.alertCtrl.create({
      header: 'Confirm locking the transfer?',
      message: 'You will no longer be able to edit the transfer once it\'s locked.',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: async () => {
            const loader = await this._loadingCtrl.create();
            loader.present();
            this.transferService.makeTransfertoLock(transfer).subscribe(async response => {

              const toast = await this._toastCtrl.create({
                message: response.message,
                duration: 3000
              });
              toast.present();

              this.loadData();

              loader.dismiss();

              this.eventService.reloadStats$.next({
                company_id: this.transfer.company_id
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Marking Transfer as Payment Sent
   */
  async paymentSent(transfer: Transfer) {
    const loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.makePaymentSent(transfer).subscribe(async response => {

      const toast = await this._toastCtrl.create({
        message: response.message,
        duration: 3000
      });
      toast.present();

      this.loadData();

      loader.dismiss();

      this.eventService.reloadStats$.next({
        company_id: this.transfer.company_id
      });
    });
  }

  /**
   * Download the receipt as specified by invoice_id
   * @param invoice
   */
  async downloadReceipt(invoice: Invoice) {
    const loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadReceipt(invoice).subscribe(response => {
      // this.navCtrl.pop();
      loader.dismiss();
    });
  }

  downloadLatestInvoice() {
    this.downloadInvoice(this.transfer.invoices[this.transfer.invoices.length - 1]);
  }

  /**
   * Download the invoice as specified by invoice_id
   * @param invoice
   */
  async downloadInvoice(invoice) {
    const loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadInvoice(invoice).subscribe(response => {
      loader.dismiss();
    });
  }

  /**
   * Calculating Total cost
   * @param hourly_rate
   * @param hours
   * @param bonus
   * @param transfer_cost
   */
  totalCost(hourly_rate, hours, bonus, transfer_cost) {
    return (2 * Number(hours)) + Number(bonus) + Number(transfer_cost);
  }

  async importTransfer(transfer: Transfer) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

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

        this.eventService.reloadStats$.next({
          company_id: this.transfer.company_id
        });
      }
    });
    modal.present();
  }

  /**
   * Load the Transfer form page to edit the transfer details
   */
  async edit(transfer: any) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: TransferFormPage,
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

        this.eventService.reloadStats$.next({
          company_id: this.transfer.company_id
        });
      }
    });
    modal.present();
  }

  /**
   * Delete the transfer
   * @param transfer
   */
  async delete(transfer: Transfer) {
    const alert = await this.alertCtrl.create({
      header: 'Do you really want to delete this transfer?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteConfirmed(transfer);
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Confirm deletion of the transfer
   * @param transfer
   */
  async deleteConfirmed(transfer: Transfer) {
    const loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.delete(transfer).subscribe(async response => {
      loader.dismiss();

      if (response.operation == 'success') {

        this.eventService.transferDeleted$.next({});

        this.eventService.reloadStats$.next({
          company_id: this.transfer.company_id
        });

        this.back();

      } else {
        const alert = await this.alertCtrl.create({
          message: response.message,
          buttons: ['Okay']
        });
        alert.present();
      }
    });
  }

  /**
   * On Candidate Selected
   * @param model
   */
  loadCandidateDetail(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }

  /**
   * Calculating Total per Candidate
   */
  total(candidate) {
    return Number((candidate.company_hourly_rate * candidate.hours) + candidate.bonus).toFixed(3);
  }

  /**
   * close page
   */
  back() {
    this.modalCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss();
      } else {
        this.navCtrl.back();
      }
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
   toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
  }
}
