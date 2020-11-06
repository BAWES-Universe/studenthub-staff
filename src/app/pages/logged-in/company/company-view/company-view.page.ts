import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ModalController, AlertController, ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { CompanyNoteService } from 'src/app/providers/logged-in/company-note.service';
import { BrandService } from 'src/app/providers/logged-in/brand.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { CompanyContact } from 'src/app/models/company-contact';
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
import { Brand } from 'src/app/models/brand';
import { Note } from 'src/app/models/note';
import { Request } from 'src/app/models/request';
// pages
import { UploadFilePage } from '../upload-file/upload-file.page';
import { CompanyContactFormPage } from '../company-contact-form/company-contact-form.page';
import { CompanyFollowupNotePage } from '../company-followup-note/company-followup-note.page';
import { CompanyRequestFormPage } from '../company-request-form/company-request-form.page';
import { CompanyNoteFormPage } from '../company-note-form/company-note-form.page';
import { BrandFormPage } from '../brand-form/brand-form.page';
import { StoreFormPage } from '../../store/store-form/store-form.page';
import {CompanyFormPage} from 'src/app/pages/logged-in/company/company-form/company-form.page';

import NumberFormat = Intl.NumberFormat;


@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  @ViewChild('statsChart') statsChart;

  @ViewChild('ckeditor') ckeditor;

  public followup = false;

  public editorFocused: boolean = false;

  public Editor = ClassicEditor;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public company_id;

  public company: Company;
  public subCompanies: Company[] = [];
  public stores: Store[] = [];

  public requests: Request[] = [];

  public companyContacts: CompanyContact[] = [];

  public brands: Brand[] = [];

  public deleting = false;
  public loading = false;
  public updating = false;

  public addingNote = false;

  public sendingNewPassword = false;
  public statsData: any[];
  public segment = 'info';

  public noteForm: FormGroup;

  bars: any;
  colorArray: any;

  public legendDisplay = true;
  public editNoteData: Note = new Note();

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public companyService: CompanyService,
    public eventService: EventService,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public brandService: BrandService,
    public noteService: CompanyNoteService,
    public companyContactService: CompanyContactService,
    public storeService: StoreService,
    public awsService: AwsService
  ) {
  }

  ngOnInit() {

    // Load the passed model if available
    if (window && window.history.state) {
      this.company = window.history.state.model;
      if (this.company && this.company.parentTransfers) {
        this.statsData = this.company.parentTransfers.reverse();
      }
      this.loadChartStats();
    }

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    this.loadData();
    this.loadContacts();
    this.loadRequests();

    if (this.platform.is('mobile')) {
      this.legendDisplay = false;
    }

    this.initNoteForm();
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

    setTimeout(_=>{
      this.followup = !!(this.company && this.company.company_followup);
    },500);


    if (!this.company) {
      this.company = new Company;
      this.company.company_id = this.company_id;
    }

    this.companyService.view(this.company_id).subscribe(response => {

      this.loading = false;
      this.deleting = false;
      this.updating = false;

      this.company = response;

      setTimeout(_=>{
        this.followup = !!(this.company.company_followup);
      },500);

      this.subCompanies = response.subCompanies;
      this.stores = response.stores;

      this.brands = response.brands;

      if (this.company && this.company.parentTransfers) {
        this.statsData = this.company.parentTransfers.reverse();
      }

      this.loadChartStats();

    }, () => {
      this.loading = false;
      this.deleting = false;
      this.updating = false;
    });
  }

  loadRequests() {
    this.requestService.list(this.company_id).subscribe(response => {
      this.requests = response;
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
   * toggle followup status
   * @param $event
   */
  toggleFollowup($event) {
    // if same value then do nothing
    if (this.followup == $event.detail.checked){
      return;
    }

    this.followup = $event.detail.checked;
    this.company.company_followup = $event.detail.checked;

    this.updating = true;

    this.companyService.updateFollowup(this.company).subscribe(async response => {

      this.updating = false;

      if (response && response.operation == 'success') {
        const toast = await this.toastCtrl.create({
          message: response.message,
          duration: 3000
        });
        toast.present();

        this.eventService.reloadFollowupList$.next();
      }

    }, () => {
      this.updating = false;
    });
  }

  /**
   * update company follow up interval in week
   */
  async updateFollowupInterval() {
    const alert = await this.alertCtrl.create({
      header: 'Follow up',
      inputs: [
        {
          name: 'interval',
          type: 'number',
          value: this.company.company_followup_interval_weeks,
          placeholder: 'Enter interval in weeks'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Submit',
          handler: (data) => {

            this.updating = true;

            this.companyService.updateFollowupInterval(this.company_id, data.interval).subscribe(async resp => {
              this.updating = false;

              if (resp.operation != 'success') {
                const prompt = await this.alertCtrl.create({
                  header: 'Error!',
                  message: resp.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }
              else {
                this.company.company_followup_interval_weeks = data.interval;
              }

            }, () => {
              this.updating = false;
            });
          }
        }
      ]
    });
    alert.present();
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
                  return e.store_id != store.store_id;
                });
              }
            }, () => {
              this.updating = false;
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
  /**
   * open brand edit page
   * @param mall
   */
  async mallSelected(mall) {
    this.router.navigate(['mall-view', mall.mall_uuid], {
      state: {
        model: mall
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

  onEditorFocus() {
    this.editorFocused = true;
  }

  /**
   * on note editor change
   * @param event
   */
  onChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.noteForm.controls.note.setValue(data);
    this.noteForm.markAsDirty();
    this.noteForm.updateValueAndValidity();
  }

  initNoteForm() {
    this.noteForm = this.fb.group({
      note: ['', Validators.required],
    });
  }

  addNote() {
    this.addingNote = true;

    const model = new Note;
    model.company_id = this.company_id;
    model.note_text = this.noteForm.controls.note.value;

    this.noteService.create(model).subscribe(async jsonResponse => {

      this.addingNote = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        this.editorFocused = false;

        this.noteForm.reset();

        this.ckeditor.editorInstance.setData('');

        this.loadData(false);
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService._processResponseMessage(jsonResponse),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, () => {
      this.editorFocused = false;
      this.addingNote = false;
    });
  }

  cancelAddNote() {
    this.editorFocused = false;
  }

  async editNote(note: Note) {
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
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * Load company detail page when its selected from the list
   * @param model
   */
  rowSelected(model) {
    this.router.navigate(['company-view', model.company_id], {
      state: {
        model
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
        model
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

    const companyContact = new CompanyContact;
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

              if (response.operation == 'success') {
                this.companyContacts = this.companyContacts.filter(e => e.contact_uuid != companyContact.contact_uuid);
              }
              else {
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

  /**
   * upload company document to S3
   */
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
        request,
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
      this.loadRequests();
    }
  }

  async addRequest() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const request = new Request;

    this.company.companyContacts = this.companyContacts;

    if (this.company.companyContacts.length == 0) {
      return this.addCompanyContact();
    }

    const modal = await this.modalCtrl.create({
      component: CompanyRequestFormPage,
      componentProps: {
        company: this.company,
        request,
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
      this.loadRequests();
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

    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {
            if (data.feedback) {
              request.request_feedback = data.feedback;
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
            } else {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['ok']
              }).then(alert => {
                alert.present();
              });
            }
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  deliveredRequest(event, request) {

    event.preventDefault();
    event.stopPropagation();


    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {
            if (data.feedback) {
              request.request_feedback = data.feedback;
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
            } else {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['ok']
              }).then(alert => {
                alert.present();
              });
            }
          }
        }
      ]
    }).then(alert => { alert.present(); });

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
   * @param allTransfers
   * @param pointBackgroundColors
   */
  createStatsChart(
    xAxis,
    complete,
    paymentReceived,
    inProgress,
    profit,
    totalCandidates,
    totalCandidatePaid,
    canAvgPayment,
    averageProfitPerCandidate,
    allTransfers,
    pointBackgroundColors
  ) {
    if (this.segment == 'info' && this.statsChart && this.statsChart.nativeElement) {
      this.bars = new Chart(this.statsChart.nativeElement, {
        type: 'line',
        data: {
          // labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
          // https://stackoverflow.com/questions/28159595/chartjs-different-color-per-data-point
          datasets: [
            {
              label: 'Transfers (' + allTransfers.length + ')',
              display: false,
              data: allTransfers,
              pointBackgroundColor: pointBackgroundColors,
              pointBorderColor: pointBackgroundColors,
              fill: false,
              backgroundColor: 'rgb(38, 194, 129)',
              borderColor: 'rgb(38, 194, 129)',
              borderWidth: 1
            },
            {
              label: 'Profit (' + profit.length + ')',
              fill: false,
              data: profit,
              backgroundColor: 'red',
              borderColor: 'red',
              borderWidth: 1
            }
            , {
              label: 'Total Candidates (' + totalCandidates.length + ')',
              fill: false,
              data: totalCandidates,
              backgroundColor: 'Blue',
              borderColor: 'Blue',
              borderWidth: 1
            }, {
              label: 'Total Candidates Paid (' + totalCandidatePaid.length + ')',
              fill: false,
              data: totalCandidatePaid,
              backgroundColor: '#ffbf00',
              borderColor: '#ffbf00',
              borderWidth: 1
            }, {
              label: 'Average Candidates Payment (' + canAvgPayment.length + ')',
              fill: false,
              data: canAvgPayment,
              backgroundColor: '#F5CAC3',
              borderColor: '#F5CAC3',
              borderWidth: 1
            }
            , {
              label: 'Average Profit Per Candidate (' + averageProfitPerCandidate.length + ')',
              fill: false,
              data: averageProfitPerCandidate,
              backgroundColor: '#00ffff',
              borderColor: '#00ffff',
              borderWidth: 1
            }
          ]
        },
        options: {
          legend: {
            display: this.legendDisplay,
            position: 'bottom'
          },
          scales: {
            xAxes: [{
              // display: false,
              type: 'category',
              labels: xAxis,
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: (value) => {
                  return (new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'KWD',
                  })).format(value);
                }
              }
            }]
          },
          tooltips: {
            callbacks: {
              label: (context) => {

                let label = '';
                // let label = context.label || '';Complete/payment received/inprogress
                if (context.datasetIndex == 0) {
                  if (allTransfers[context.index].status == '4') {
                    label += '\nTransfer Completed on ' + context.label + '\n';
                  } else if (allTransfers[context.index].status == '1') {
                    label += '\nConfirm Received on ' + context.label + '\n';
                  } else if (allTransfers[context.index].status == '3') {
                    label += '\nDistribution in Progress on ' + context.label + '\n';
                  }
                }


                if (context.datasetIndex == 1) {
                  label += '\nProfit on ' + context.label + '\n';
                } else if (context.datasetIndex == 2) {
                  label += '\nTotal Candidates on ' + context.label + '\n';
                } else if (context.datasetIndex == 3) {
                  label += '\nTotal Candidates Paid on ' + context.label + '\n';
                } else if (context.datasetIndex == 4) {
                  label += '\nAverage Candidates Payment on ' + context.label + '\n';
                } else if (context.datasetIndex == 5) {
                  label += '\nAverage Profit Per Candidate on ' + context.label + '\n';
                }

                if (context.datasetIndex == 2) {
                  label += 'are ' + allTransfers[context.index].totalCandidateTransferTotal;
                } else if (!isNaN(context.yLabel)) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'KWD'
                  }).format(context.yLabel);
                }
                return label;
              }
            }
          }
        }
      });
    }
  }

  loadChartStats() {
    const allTransfers = [];
    const complete = [];
    const paymentReceived = [];
    const inprogress = [];
    const xAxis = [];
    const profit = [];
    const totalCandidates = [];
    const totalCandidatePaid = [];
    const canAvgPayment = [];
    const averageProfitPerCandidate = [];
    const pointBackgroundColors = [];
    if (this.company && this.statsData && this.statsData.length > 0) {
      for (const transfer of this.statsData) {
        // Complete/payment received/inprogress
        if (transfer.transfer_status == 4 || transfer.transfer_status == 1 || transfer.transfer_status == 3) {
          // Complete/payment received/inprogress
          if (transfer.transfer_status == 4) {
            // Complete transfer
            complete.push(transfer.company_total.replace(/,/g, ''));
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
            const tProfit = transfer.profit.replace(/,/g, '');
            profit.push(tProfit);
          }

          // one line showing candidates count transferred to in that transfer
          if (transfer.totalCandidateTransferTotal) {
            totalCandidates.push(transfer.totalCandidateTransferTotal);
          }

          // one line for total distributed to candidates
          // let totalPaid = 0;
          // for (const candidatePaid of transfer.paidTransferCandidates) {
          //   totalPaid += candidatePaid.total_paid;
          // }
          totalCandidatePaid.push(transfer.total);

          // average payment per candidate
          canAvgPayment.push((transfer.total / transfer.totalPaid));

          // Also average profit per candidate would be nice
          const profits = 0;
          if (transfer.profit && transfer.paidTransferCandidates && transfer.paidTransferCandidates.length > 0) {
            const profits = transfer.profit.replace(/,/g, '');
            averageProfitPerCandidate.push((profits / transfer.paidTransferCandidates.length));
          }

          allTransfers.push({
            x: transfer.transfer_created_at_unix,
            y: transfer.company_total.replace(/,/g, ''),
            id: '1A',
            transfer_id: transfer.transfer_id,
            total: transfer.company_total,
            status: transfer.transfer_status,
            profit: transfer.profit.replace(/,/g, ''),
            totalCandidateTransferTotal: transfer.totalCandidateTransferTotal,
            totalCandidatePaid: transfer.total,
            canAvgPayment: (transfer.total / transfer.totalPaid),
            averageProfitPerCandidate: (profits / transfer.paidTransferCandidates.length),
          });

          if (transfer.transfer_status == 4) {
            pointBackgroundColors.push('rgb(38, 194, 129)');
          } else if (transfer.transfer_status == 1) {
            pointBackgroundColors.push('#8000ff');
          } else if (transfer.transfer_status == 3) {
            pointBackgroundColors.push('#387ef5');
          }

          // Horizontal line shows transfer date
          xAxis.push(transfer.transfer_created_at_unix);
        }
      }

      this.createStatsChart(
        xAxis, complete, paymentReceived,
        inprogress, profit, totalCandidates,
        totalCandidatePaid, canAvgPayment,
        averageProfitPerCandidate,
        allTransfers,
        pointBackgroundColors
      );
    }
  }

  onEditorReady(event: any) {
    // this.editorReady = event.editor;
  }

  /**
   * Create a new company
   * @param parent_company_id
   * @param isSubcompany
   */
  async create(parent_company_id: number, isSubcompany: boolean = false) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const company = new Company();

    company.parent_company_id = parent_company_id;

    const modal = await this.modalCtrl.create({
      component: CompanyFormPage,
      componentProps: {
        model: company,
        company_id: company.company_id,
        subcompany : isSubcompany
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
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyFormPage,
      componentProps: {
        model: this.company,
        company_id: this.company_id,
        subcompany: 0
      }
    });
    // Refresh List if required
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

}
