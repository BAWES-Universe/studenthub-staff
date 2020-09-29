import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ModalController, AlertController, ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
//services
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { CompanyNoteService } from 'src/app/providers/logged-in/company-note.service';
import { BrandService } from 'src/app/providers/logged-in/brand.service';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
import { Brand } from 'src/app/models/brand';
import { Note } from 'src/app/models/note';
import { Request } from 'src/app/models/request';
//pages
import { UploadFilePage } from "../upload-file/upload-file.page";
import { CompanyContactFormPage } from '../company-contact-form/company-contact-form.page';
import { CompanyFollowupNotePage } from '../company-followup-note/company-followup-note.page';
import { CompanyRequestFormPage } from '../company-request-form/company-request-form.page';
import { CompanyNoteFormPage } from '../company-note-form/company-note-form.page';
import { BrandFormPage } from '../brand-form/brand-form.page';
import { StoreFormPage } from '../../store/store-form/store-form.page';


@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  @ViewChild('barChart') barChart;
  public company_id;

  public company: Company;
  public subCompanies: Company[] = [];
  public stores: Store[] = [];

  public companyContacts: CompanyContact[] = [];

  public brands: Brand[] = [];

  public deleting = false;
  public loading = false;
  public updating = false;

  public sendingNewPassword = false;

  public segment: string = 'info';
  bars: any;
  colorArray: any;
  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public companyService: CompanyService,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public brandService: BrandService,
    public noteService: CompanyNoteService,
    public companyContactService: CompanyContactService,
    public storeService: StoreService,
    public awsService: AwsService
  ) {
    this.generateColorArray(8);
  }

  ngOnInit() {

    // Load the passed model if available
    if (window && window.history.state) {
      this.company = window.history.state.model;
      this.loadChartStats();
    }

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    this.loadData();
    this.loadContacts();
  }

  /**
   * load compay data
   */
  async loadData(silent = false) {

    if (!silent) {
      this.loading = true;
    } else {
      this.updating = true;
    }

    if (!this.company) {
      this.company = new Company;
      this.company.company_id = this.company_id;
    }

    this.companyService.view(this.company_id).subscribe(response => {

      this.loading = false;
      this.deleting = false;
      this.updating = false;

      this.company = response;

      this.subCompanies = response.subCompanies;
      this.stores = response.stores;

      this.brands = response.brands;
      this.loadChartStats();

    }, () => {
      this.loading = false;
      this.deleting = false;
      this.updating = false;
    });
  }

  /**
   * Loads the create page
   */
  async addStore() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        company_id: this.company_id,
        company: this.company,
        brands: this.company.brands
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData(true);
      }
    });
    return await modal.present();
  }

  /**
   * Delete the provided model
   */
  async deleteStore(event, store: Store) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Store',
      message: 'Are you sure you want to delete this Store?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.updating = true;

            this.storeService.delete(store).subscribe(async jsonResp => {

              this.updating = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: jsonResp.message,
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();

                this.stores = this.stores.filter(e => {
                  return e.store_id != store.store_id
                });
              }
            }, () => {
              this.updating = false;
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            // this.loadData(this.currentPage);
            // loader.dismiss();
            console.log('no');
          }
        }
      ]
    });
    confirm.present();
  }

  async deleteBrand(event, brand) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Brand',
      message: 'Do you want to delete this brand?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.brandService.delete(brand).subscribe(async jsonResp => {

              // On Success
              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();

                this.loadData(true);
              }

              // On Failure
              if (jsonResp.operation == 'error') {

                this.deleting = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: jsonResp.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }

            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  /**
   * open brand edit page
   * @param brand
   */
  async brandSelected(brand) {
    this.router.navigate(['brand-view', brand.brand_uuid], {
      state: {
        model: brand
      }
    });
  }

  async editBrandSelected(event, brand) {

    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: BrandFormPage,
      componentProps: {
        model: brand
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadData(true);
      }
    });
    modal.present();
  }

  /**
   * form to add new brand
   */
  async addBrand() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const brand = new Brand;
    brand.company_id = this.company_id;

    const modal = await this.modalCtrl.create({
      component: BrandFormPage,
      componentProps: {
        model: brand
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadData(true);
      }
    });
    modal.present();
  }

  async addNote(note: Note) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        company: this.company,
        note,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadData(false);
    }
  }

  /**
   * removing note
   * @param event
   * @param note
   */
  async removeNote(event, note) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Note',
      message: 'Do you want to delete this note?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.noteService.delete(note).subscribe(async response => {

              this.deleting = false;

              if (response.operation == 'success') {
                this.loadData(true);
              } else {

                this.deleting = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: response.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deleting = false;
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  /**
   * add followup note
   */
  async addFollowupNote() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyFollowupNotePage,
      componentProps: {
        company_id: this.company_id
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.company_last_followup_datetime && this.company) {
        this.company.company_last_followup_datetime = e.data.company_last_followup_datetime;
        this.loadData(true);
      }
    });
    modal.present();
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  /**
   * Load company detail page when its selected from the list
   * @param model
   */
  rowSelected(model) {
    this.router.navigate(['company-view', model.company_id], {
      state: {
        model: model
      }
    });
  }

  /**
   * push select company data to store view
   * @param model
   */
  storeSelected(model) {
    this.router.navigate(['store-view', model.store_id], {
      state: {
        model: model
      }
    });
  }

  loadContacts() {
    this.companyContactService.companyContacts(this.company_id).subscribe(data => {
      this.companyContacts = data;
    });
  }

  async onContactSelected(companyContact) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: {
        model: companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadContacts();
      }
    });
    modal.present();
  }

  async addCompanyContact() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let companyContact = new CompanyContact;
    companyContact.company_id = this.company_id;

    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: {
        model: companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadContacts();
      }
    });
    modal.present();
  }

  doNothing(event) {
    event.stopPropagation();
  }

  async deleteContact(event, companyContact) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Contact',
      message: 'Do you want to delete this contact?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.companyContactService.delete(companyContact).subscribe(async response => {

              this.deleting = false;

              if (response.operation == 'success')
              {
                this.companyContacts = this.companyContacts.filter(e => e.contact_uuid != companyContact.contact_uuid);
              }
              else
              {
                const prompt = await this.alertCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deleting = false;
            });
          },
        },
        {
          text: 'No',
        }
      ]
    });
    confirm.present();
  }

  segmentChanged($event) {
    if ($event.detail.value == 'info') {
      setTimeout(() => {
        this.loadChartStats();
      }, 150);
    }
    this.segment = $event.detail.value;
  }

  async uploadDocument() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UploadFilePage,
      componentProps: {
        company: this.company,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadData();
    }
  }

  async editRequest(request) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    this.company.companyContacts = this.companyContacts;

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        company: this.company,
        request: request,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadData();
    }
  }

  async addRequest() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let request = new Request;

    this.company.companyContacts = this.companyContacts;

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        company: this.company,
        request: request,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadData();
    }
  }

  startRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.start(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'started';
      } else {
        this.toastCtrl.create({
          message: response.message,
          buttons: ['Ok']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  cancelledRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.cancel(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'cancelled';
      } else {
        this.toastCtrl.create({
          message: response.message,
          buttons: ['Ok']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  deliveredRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();

    this.requestService.deliver(request).subscribe(async response => {

      if (response.operation == 'success') {
        request.request_status = 'delivered';
      } else {
        this.toastCtrl.create({
          message: response.message,
          buttons: ['Ok']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }

  ionViewDidEnter() {
    // this.createBarChart();
  }

  /**
   * @param xAxis
   * @param complete
   * @param paymentReceived
   * @param inProgress
   * @param profit
   * @param totalCandidates
   * @param totalCandidatePaid
   * @param canAvgPayment
   * @param averageProfitPerCandidate
   */
  createBarChart(
    xAxis,
    complete,
    paymentReceived,
    inProgress,
    profit,
    totalCandidates,
    totalCandidatePaid,
    canAvgPayment,
    averageProfitPerCandidate
  ) {
    if (this.barChart.nativeElement) {
      this.bars = new Chart(this.barChart.nativeElement, {
        type: 'line',
        data: {
          labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
          datasets: [
            {
              label: 'Completed Transfer',
              data: complete,
              fill: false,
              // backgroundColor: this.colorArray,
              backgroundColor: 'rgb(38, 194, 129)',
              borderColor: 'rgb(38, 194, 129)',
              borderWidth: 1
            }, {
              label: 'Received Transfer',
              fill: false,
              data: paymentReceived,
              backgroundColor: '#8000ff',
              borderColor: '#8000ff',
              borderWidth: 1
            }, {
              label: 'In Progress Transfer',
              fill: false,
              data: inProgress,
              backgroundColor: '#387ef5',
              borderColor: '#387ef5',
              borderWidth: 1
            }, {
              label: 'Profit',
              fill: false,
              data: profit,
              backgroundColor: 'red',
              borderColor: 'red',
              borderWidth: 1
            }, {
              label: 'Total Candidates',
              fill: false,
              data: totalCandidates,
              backgroundColor: 'Blue',
              borderColor: 'Blue',
              borderWidth: 1
            }, {
              label: 'Total Candidates Paid',
              fill: false,
              data: totalCandidatePaid,
              // backgroundColor: '#ffff00',
              borderColor: '#ffbf00',
              borderWidth: 1
            }, {
              label: 'Average Candidates Payment',
              fill: false,
              data: canAvgPayment,
              // backgroundColor: '#ffff00',
              borderColor: '#F5CAC3',
              borderWidth: 1
            }, {
              label: 'Average Profit Per Candidate',
              fill: false,
              data: averageProfitPerCandidate,
              // backgroundColor: '#ffff00',
              borderColor: '#00ffff',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'category',
              labels: xAxis
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  }

  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
  }

  loadChartStats() {

    const complete = [0];
    const paymentReceived = [0];
    const inprogress = [0];
    const xAxis = [0];
    const profit = [0];
    const totalCandidates = [0];
    const totalCandidatePaid = [0];
    const canAvgPayment = [0];
    const averageProfitPerCandidate = [0];
    if (this.company) {
      console.log(this.company.parentTransfers);
      if (this.company.parentTransfers && this.company.parentTransfers.length > 0) {
        for (const transfer of this.company.parentTransfers) {
          // Complete/payment received/inprogress

          if (transfer.transfer_status == 4) {
            // Complete transfer
            complete.push(transfer.company_total);
          }

          if (transfer.transfer_status == 1) {
            // payment received transfer
            paymentReceived.push(transfer.company_total);
          }

          if (transfer.transfer_status == 3) {
            // Inprogress transfer
            inprogress.push(transfer.company_total);
          }

          // one line for profit
          if (transfer.profit) {
            profit.push(transfer.profit);
          }

          // one line showing candidates count transferred to in that transfer
          if (transfer.totalCandidateTransferTotal) {
            totalCandidates.push(transfer.totalCandidateTransferTotal);
          }

          // one line for total distributed to candidates
          let totalPaid = 0;
          for (const candidatePaid of transfer.paidTransferCandidates) {
            totalPaid += candidatePaid['total_paid'];
          }
          totalCandidatePaid.push(totalPaid);

          // average payment per candidate
          canAvgPayment.push((totalPaid / transfer.totalPaid));


          // Also average profit per candidate would be nice
          if (transfer.profit && transfer.paidTransferCandidates && transfer.paidTransferCandidates.length > 0) {
            averageProfitPerCandidate.push((transfer.profit / transfer.paidTransferCandidates.length));
          }


          // Horizontal line shows transfer date
          xAxis.push(transfer.transfer_updated_at_unix);
        }
        this.createBarChart(xAxis, complete, paymentReceived, inprogress, profit, totalCandidates, totalCandidatePaid, canAvgPayment, averageProfitPerCandidate);
      }
    }
  }
}
