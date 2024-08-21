import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Note } from 'src/app/models/note';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//services
import { EventService } from 'src/app/providers/event.service';
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
//pages
import { CompanyNoteFormPage } from '../../company/company-note-form/company-note-form.page';


@Component({
  selector: 'app-fulltimer-notes',
  templateUrl: './fulltimer-notes.page.html',
  styleUrls: ['./fulltimer-notes.page.scss'],
})
export class FulltimerNotesPage implements OnInit {

  public borderLimit;

  public loading: boolean = false;

  public fulltimer_uuid;

  public fulltimer;

  public notes: Note[] = [];

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public fulltimerService: FulltimerService,
    public analyticService: AnalyticsService,
    public noteService: NoteService
  ) {
  }

  ngOnInit() {

    this.analyticService.page('Fulltimer Notes Page');

    if(!this.fulltimer_uuid)
      this.fulltimer_uuid = this.activatedRoute.snapshot.paramMap.get('fulltimer_uuid');

    const state = window.history.state;

    if(state && state.fulltimer) {
      this.fulltimer = state.fulltimer;
    }

    if(!this.fulltimer) {
      this.loadfulltimerDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadfulltimerDetail();
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data.fulltimer_uuid == this.fulltimer_uuid) {
        this.loadNotes();
      }
    });

    this.loadNotes();
  }

  loadfulltimerDetail(loading = true) {
    this.loading = loading;

    this.fulltimerService.view(this.fulltimer_uuid).subscribe(response => {

      this.loading = false;
      this.fulltimer = response;
    });
  }

  /**
   * load fulltimer notes without pagination
   */
  loadNotes() {
    const params = '&fulltimer_uuid=' + this.fulltimer_uuid;

    this.noteService.list(params).subscribe(async jsonResponse => {
      this.notes = jsonResponse;
    });
  }

  /**
   * open popup to update modal
   */
  async add() {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    let note = new Note;
    note.fulltimer_uuid = this.fulltimer_uuid;

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note,
        fulltimer: this.fulltimer
      },
      cssClass: "popup-modal"
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

      this.eventService.noteUpdated$.next({
        fulltimer_uuid: this.fulltimer_uuid
      });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
