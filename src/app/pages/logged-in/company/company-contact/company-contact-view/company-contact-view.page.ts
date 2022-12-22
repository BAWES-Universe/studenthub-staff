import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {AlertController, LoadingController, ModalController, NavController, Platform, PopoverController} from '@ionic/angular';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { Note } from 'src/app/models/note';
import { Contact } from 'src/app/models/contact';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { AuthService } from 'src/app/providers/auth.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { EventService } from 'src/app/providers/event.service';
//pages
import { CompanyContactFormPage } from '../../company-contact-form/company-contact-form.page';
import { CompanyNotesPage } from '../../company-notes/company-notes.page';
import { Request } from 'src/app/models/request';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { ActionComponent } from 'src/app/components/action/action.component';


@Component({
  selector: 'app-company-contact-view',
  templateUrl: './company-contact-view.page.html',
  styleUrls: ['./company-contact-view.page.scss'],
})
export class CompanyContactViewPage implements OnInit {

  @ViewChild('ckeditor') ckeditor;

  public contact_uuid: string;

  public company_id;

  public loadingNotes: boolean = false;

  public loading: boolean = false;

  public deleting: boolean = false;

  public companyContact: CompanyContact = null;

  public contact: Contact;

  public requests: Request[] = [];

  public notes: Note[] = [];
  public notesTotal;

  loadingRequests = false;

  pageCountRequest;
  currentPageRequest;
  totalRequests;

  public deletingNote = false;

  public pageCount: number;

  public currentPage: number;

  public borderLimit;

  public segment = 'details';

  constructor(
    private fb: FormBuilder,
    public navCtrl: NavController,
    public location: Location,
    public platform: Platform,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public noteService: NoteService,
    public eventService: EventService,
    public _loadingCtrl: LoadingController,
    public companyContactService: CompanyContactService
  ) { }

  ngOnInit() {
    window.analytics.page('Company Contact View Page');

    if(!this.contact_uuid)
      this.contact_uuid = this.route.snapshot.params['contact_uuid'];

    this.company_id = this.route.snapshot.params['company_id'];

    const model = window.history.state.model;

    /*if(model) {
      // this.companyContact = model;
      this.loadNotes();
      this.loadRequests();

    }*/

    //if(!this.companyContact) {
      this.loadDetail();
    //}

    if(!this.companyContact && this.company_id) {
      this.loadCompanyContact();
    }

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data.contact_uuid == this.contact_uuid) {
        this.loadNotes();
      }
    });

    this.eventService.requestCountUpdated$.subscribe((data: any) => {
      this.loadRequests();
    });
  }

  /**
   * load more requests on scroll to bottom
   * @param event
   */
  doInfiniteRequests(event) {

    const searchParams = this.requestUrlParams();

    this.currentPage++;

    this.loadingRequests = true;

    this.requestService.listWithPagination(this.currentPage, searchParams).subscribe(response => {
      this.loadingRequests = false;

      this.pageCountRequest = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPageRequest = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalRequests = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.requests = this.requests.concat(response.body);
    },
    error => { },
    () => {
      this.loadingRequests = false;

      event.target.complete();
    });
  }

  /**
   * load requests
   */
  loadRequests()
  {
    this.loadingRequests = true;

    const urlParams = this.requestUrlParams();

    this.requestService.listWithPagination(1, urlParams).subscribe(response => {

      this.pageCountRequest = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPageRequest = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalRequests = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.requests = response.body;

    },
      error => { },
      () => { this.loadingRequests = false; }
    );
  }

  requestUrlParams() {
    let url = '&contact_uuid=' + this.contact_uuid;

    if(this.company_id) {
      url += '&company_id=' + this.company_id;
    }

    return url;
  }

  /**
   * load role details
   */
  loadCompanyContact() {
    this.companyContactService.viewCompanyContact(this.contact_uuid, this.company_id).subscribe(data => {
      this.companyContact = data;
    });
  }

  addNote() {
    this.openNotes(true);
  }

  async openNotes(addNewNote = false) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyNotesPage,
      componentProps: {
        company: this.contact.company,
        addNewNote: addNewNote,
        editorFocused: addNewNote
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
   * load request detail
   */
  loadDetail() {
    this.loading = true;

    this.companyContactService.view(this.contact_uuid).subscribe(data => {
      this.contact = data;

      this.loadNotes();
      this.loadRequests();
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  async edit() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: {
        model: this.contact,
        companyContact: this.companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadDetail();
      }
    });
    modal.present();
  }

  async delete() {

    const confirm = await this.alertCtrl.create({
      header: 'Delete Contact',
      message: 'Do you want to delete this contact?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.companyContactService.delete(this.companyContact).subscribe(async response => {

              this.deleting = false;

              if (response.operation == 'success') {
                this.eventService.reloadStats$.next({
                  company_id: this.companyContact.company_id
                });
                this.location.back();
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

  async sendVerificationMail() {
    const loader = await this._loadingCtrl.create();
    loader.present();
    this.companyContactService.sendEmail(this.companyContact).subscribe(async response => {

      this.deleting = false;

        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Ok']
        });
        prompt.present();

    }, () => {
      loader.dismiss();
    }, () => loader.dismiss() );
  }

  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-list'
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

    if (date)
      return new Date(date.replace(/-/g, '/'));
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

            this.deletingNote = true;

            this.noteService.delete(note).subscribe(async response => {

              this.deletingNote = false;

              if (response.operation == 'success') {
                this.loadNotes();
              } else {

                this.deletingNote = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: response.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deletingNote = false;
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
   * load notes
   */
  loadNotes() {
    const searchParams = this.urlParams();

    this.loadingNotes = true;

    this.noteService.list(searchParams, 1).subscribe(async response => {

      this.loadingNotes = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.notesTotal = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.notes = response.body;
    });
  }

  urlParams() {
    let url = '&contact_uuid=' + this.contact_uuid;

    if(this.company_id) {
      url += '&company_id=' + this.company_id;
    }

    return url;
  }

  doInfinite(event) {

    const searchParams = this.urlParams();

    this.currentPage++;
    this.loadingNotes = true;

    this.noteService.list(searchParams, this.currentPage).subscribe(response => {
      this.loadingNotes = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.notes = this.notes.concat(response.body);
    },
    error => { },
    () => {
      this.loadingNotes = false;

      event.target.complete();
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0) ?  true : false;
  }

  async showActions(event) {
    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const actions = [
      {
        name: "Edit Contact",
        icon: 'assets/icon/icon-edit-2.svg',
        trigger: 'edit'
      },
      {
        name: "Delete Contact",
        icon: 'assets/icon/icon-trash-2.svg',
        trigger: 'delete'
      },
    ];

    const modal = await this.popoverCtrl.create({
      component: ActionComponent,
      componentProps: {
        actions: actions
      },
      cssClass: 'store-option',
      event,
      translucent: true,
      showBackdrop: false
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.action) {
      if(data.action.trigger == 'edit') {
        this.edit()
      } else if(data.action.trigger == 'delete') {
        this.delete()
      }  
    }
  }
}
