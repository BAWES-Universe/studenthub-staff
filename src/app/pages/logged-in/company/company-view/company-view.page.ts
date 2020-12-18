import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, ToastController, IonContent } from '@ionic/angular';
// services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Company } from 'src/app/models/company';
import { Note } from 'src/app/models/note';
// pages
import { CompanyFollowupNotePage } from '../company-followup-note/company-followup-note.page';
import { CompanyFormPage } from 'src/app/pages/logged-in/company/company-form/company-form.page';
import { TransferChartPage } from '../../transfer/transfer-chart/transfer-chart.page';
import { AwsService } from 'src/app/providers/aws.service';


@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public followup = false;

  public company_id;

  public company: Company;

  public deleting = false;
  public loading = false;
  public updating = null;

  public borderLimit = false;

  public notes: Note[] = [];

  public loadingNotes: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public companyService: CompanyService,
    public aws: AwsService,
    public eventService: EventService,
    public noteService: NoteService
  ) {
  }

  ngOnInit() {

    // Load the passed model if available
    if (window && window.history.state) {
      this.company = window.history.state.model;
    }

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    this.loadData();

    this.loadNotes();

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data.company_id == this.company_id) {
        this.loadNotes();
      }
    });
  }

  async openStores() {
    this.router.navigate(['company-stores', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openSubCompanies() {
    this.router.navigate(['company-subcompanies', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openMalls() {
    this.router.navigate(['company-malls', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openDocuments() {
    this.router.navigate(['company-documents', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openContacts() {
    this.router.navigate(['company-contacts', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openBrands() {
    this.router.navigate(['company-brands', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openNotes() {
    this.router.navigate(['company-notes', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openRequests() {
    this.router.navigate(['company-requests', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openTransfers() {
    this.router.navigate(['transfer-list', this.company_id], {
      state: {
        company: this.company
      }
    });
  }

  async openChart() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: TransferChartPage,
      componentProps: {
        model: this.company,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();
  }

  /**
   * load compay data
   */
  async loadData(silent = false) {

    setTimeout(_ => {
      this.followup = !!(this.company && this.company.company_followup);
    }, 500);

    setTimeout(_ => {
      this.loading = (!silent);
    });

    if (!this.company) {
      this.company = new Company();
      this.company.company_id = this.company_id;
    }

    this.companyService.view(this.company_id).subscribe(response => {

      this.loading = false;
      this.deleting = false;
      this.updating = false;
      this.company = response;

      setTimeout(_ => {
        this.followup = !!(this.company.company_followup);
      }, 500);

    }, () => {
      this.loading = false;
      this.deleting = false;
      this.updating = false;
    });
  }

  /**
   * toggle followup status
   * @param $event
   */
  toggleFollowup($event) {
    // if same value then do nothing
    if (this.followup == $event.detail.checked) {
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

  isFollowUpIntervalPassed() {

    if (this.company.company_followup_interval_weeks == 0 || !this.company.company_last_followup_datetime) {
      return true;
    }

    let followup_datetime = new Date(this.company.company_last_followup_datetime.replace(/-/g, '/') + ' UTC');

    //date to follow

    followup_datetime.setDate(followup_datetime.getDate() + this.company.company_followup_interval_weeks * 7);
    followup_datetime.setHours(0, 0, 0, 0);

    //current date

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return followup_datetime.getTime() <= currentDate.getTime();
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

        //to update view

        this.content.scrollToPoint(0, 1);

        this.loadNotes();
      }
    });
    modal.present();
  }

  /**
   * load company notes
   */
  loadNotes() {
    this.loadingNotes = true;

    const params = '&company_id=' + this.company_id;

    this.noteService.list(params).subscribe(response => {

      this.loadingNotes = false;

      this.notes = response;
    }, () => {
      this.loadingNotes = false;
    });
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

  imageError() {
    this.company.company_logo = null;
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
