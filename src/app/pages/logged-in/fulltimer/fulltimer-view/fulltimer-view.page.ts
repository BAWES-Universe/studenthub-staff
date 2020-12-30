import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// services
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { AwsService } from 'src/app/providers/aws.service';
import { NoteService } from '../../../../providers/logged-in/note.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Fulltimer } from 'src/app/models/fulltimer';
import { Note } from 'src/app/models/note';
import { SuggestPage } from "../../suggest/suggest.page";
// pages
import { FulltimerFormPage } from '../fulltimer-form/fulltimer-form.page';
import { CompanyNoteFormPage } from '../../company/company-note-form/company-note-form.page';


@Component({
  selector: 'app-fulltimer-view',
  templateUrl: './fulltimer-view.page.html',
  styleUrls: ['./fulltimer-view.page.scss'],
})
export class FulltimerViewPage implements OnInit {

  public borderLimit = false;

  public fulltimer_uuid: string;

  public fulltimer: Fulltimer;

  public loading = false;

  public notes: Note[] = [];

  constructor(
    public aws: AwsService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private fulltimerService: FulltimerService,
    public translateService: TranslateLabelService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public noteService: NoteService,
    public eventService: EventService,
  ) { }

  ngOnInit() {
    this.fulltimer_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadData();
    this.loadNotes(false);

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data.fulltimer_uuid == this.fulltimer_uuid) {
        this.loadNotes();
      }
    });
  }

  loadData() {
    this.loading = true;
    this.fulltimerService.view(this.fulltimer_uuid).subscribe(res => {
      this.loading = false;
      this.fulltimer = res;
    });
  }

  /**
   * open popup to update modal
   */
  async addNote() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let note = new Note;
    note.fulltimer_uuid = this.fulltimer_uuid;
    
    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note: note
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
      this.loadNotes();
    }
  }

  openNotes() {
    this.router.navigate(['fulltimer-notes', this.fulltimer_uuid], {
      state: {
        fulltimer: this.fulltimer
      }
    });
  }

  /**
   * return area name
   * @param area
   * @param country
   */
  area(area, country) {
    return this.translateService.langContent(area.area_name_en, area.area_name_ar) + ' ' +
      this.translateService.langContent(country.country_name_en, country.country_name_ar);
  }
  
  /**
   * get candidate resume url
   */
  getResumeUrl() {
    return this.aws.permanentBucketUrl + 'fulltimer-resume/' + encodeURIComponent(this.fulltimer.fulltimer_pdf_cv);
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        model: this.fulltimer,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });

    return await modal.present();
  }

  /**
   * On candidate selected from list
   */
  rowSelected(store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
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
   * load notes
   * @param loading
   */
  loadNotes(loading = true) {
    const params = '&fulltimer_uuid=' + this.fulltimer_uuid;

    this.noteService.list(params).subscribe(async jsonResponse => {
      this.notes = jsonResponse;
    });
  }

  /**
   * suggess this candidate
   */
  async suggest() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: SuggestPage,
      componentProps: {
        fulltimer: this.fulltimer
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadNotes();
      }
    });
    return await modal.present();
  }
}
