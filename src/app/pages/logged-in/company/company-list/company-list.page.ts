import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
// model
import {Company} from 'src/app/models/company';
// service
import {CompanyService} from 'src/app/providers/logged-in/company.service';
import {AwsService} from '../../../../providers/aws.service';
import {UploadFilePage} from '../upload-file/upload-file.page';
import {CompanyNoteFormPage} from "../company-note-form/company-note-form.page";
import {Note} from "../../../../models/note";
import {CompanyNoteService} from "../../../../providers/logged-in/company-note.service";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public loading = false;
  public loadingMore = false;
  public company_id = null;
  public company: Company;
  public companies: Company[];
  public segment = 1;
  public enableCompanies: Company[] = [];
  public disableCompanies: Company[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public companyService: CompanyService,
    public noteService: CompanyNoteService,
    public platform: Platform,
    public aws: AwsService,
    public toastCtrl: ToastController,
  ) {
      this.company_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {}
  ionViewWillEnter() {
    const state = window.history.state;
    if (state.companies) {
      this.company = state.company;
      this.companies = state.companies;
      this.loadCompaniesSegmentData();
    }

    if (!this.companies && this.company_id) {
      this.viewDetail(true);
    }
    if (!this.companies && !this.company_id) {
      this.loadCompanyList(this.currentPage);
    }
  }

  async loadCompanyList(page: number){
    // Load list of companies
    this.loading = true;

    this.companyService.list(page).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.companies = response.body;
        this.loadCompaniesSegmentData();
      },
      error => {},
      () => {this.loading = false; }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model: Company){
    // Check if has subCompanies
    if (model.subCompanies && model.subCompanies.length > 0){
      // Load Subcompany List
      this.navCtrl.navigateForward('company-list/' + model.company_id, {
        state : {
          company: model,
          companies: model.subCompanies
        }
      });
    }else{
      // Load store list for this company
      this.navCtrl.navigateForward('store-list/' + model.company_id);
    }
  }

  rowSelectedNew(model: Company){
    // Check if has subCompanies
    if (model.subCompanies && model.subCompanies.length > 0){
      // Load Subcompany List
      this.navCtrl.navigateForward('company-view/' + model.company_id, {
        state : {
          model
        }
      });
    }else{
      // Load store list for this company
      this.navCtrl.navigateForward('store-list/' + model.company_id);
    }
  }

  /**
   * view detail
   */
  viewDetail(loading = true) {
    this.loading = loading;
    this.companyService.view(this.company_id).subscribe( response => {
      this.loading = false;
      this.company = response;

      this.companies = response.subCompanies;
    });
  }

  segmentChanged($event) {
    this.segment = $event.detail.value;
  }

  /**
   * segment data
   */
  loadCompaniesSegmentData() {
    this.enableCompanies = [];
    this.disableCompanies = [];
    for (const company of this.companies) {
      if (company.company_status == 10) {
        this.enableCompanies.push(company);
      } else  {
        this.disableCompanies.push(company);
      }
    }
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  async uploadDocument() {
    const modal = await this.modalCtrl.create({
      component: UploadFilePage,
      componentProps: {
        company: this.company,
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.refresh) {
      this.viewDetail(false);
    }
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }


  doInfinite(event) {

    this.loadingMore = true;
    this.currentPage++;

    this.companyService.list(this.currentPage).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.companies = this.companies.concat(response.body);
        this.loadCompaniesSegmentData();
      },
      error => {},
      () => {
        this.loadingMore = false;
        event.target.complete();
      }
    );
  }

  async addNote(note: Note) {
    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        company: this.company,
        note: note,
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.refresh) {
      this.viewDetail(false);
    }
  }

  /**
   * removing note
   * @param event
   * @param note
   */
  async remoteNote(event, note) {

    event.preventDefault();
    event.stopPropagation();

    this.noteService.delete(note).subscribe(async response => {

      if (response.operation == 'success') {
        this.viewDetail(false);
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
}
