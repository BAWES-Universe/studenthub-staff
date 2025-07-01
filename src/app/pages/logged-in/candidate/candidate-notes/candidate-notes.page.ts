import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Note } from 'src/app/models/note';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
//services
import { NoteService } from 'src/app/providers/logged-in/note.service';
//pages
import { CompanyNoteFormPage } from '../../company/company-note-form/company-note-form.page';


@Component({
  selector: 'app-candidate-notes',
  templateUrl: './candidate-notes.page.html',
  styleUrls: ['./candidate-notes.page.scss'],
})
export class CandidateNotesPage implements OnInit {

  public borderLimit;

  public loading: boolean = false;

  public candidate_id;

  public candidate;

  public notes: Note[] = [];

  public filters = {
    noteType: null
  };

  public pageCount = 0;
  public total = 0;
  public currentPage = 1;

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
    public noteService: NoteService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Candidate Notes Page');

    if(!this.candidate_id)
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');

    const state = window.history.state;

    if(state && state.candidate) {
      this.candidate = state.candidate;
    }

    if(!this.candidate) {
      this.loadCandidateDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data.candidate_id == this.candidate_id) {
        this.loadNotes();
      }
    });

    this.loadNotes();
  }

  loadCandidateDetail(loading = true) {
    this.loading = loading;

    this.candidateService.detail(this.candidate_id).subscribe(response => {

      this.loading = false;

      this.candidate = response;
      if(this.candidate){
        this.candidate.pendingField =  this.candidate?.pendingField?.filter(v => v != "experience")
        this.candidate.isProfileCompleted = this.candidate.pendingField.length == 0;
      }
    });
  }

  filterByType(event, type) {
    this.filters.noteType = type;
    this.loadNotes(); // reload all result
  }

  doRefresh(event) {
    this.loadNotes();
    event.target.complete();
  }

  /**
   * load candidate notes without pagination
   */
  loadNotes() {

    this.noteService.list(this.filterParams(), 1).subscribe(async response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.notes = response.body;
    });
  }

  filterParams() {
    let params = '&candidate_id=' + this.candidate_id;

    if (this.filters.noteType) {
      params += "&note_type=" + this.filters.noteType;
    }

    return params;
  }

  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.noteService.list(this.filterParams(), this.currentPage).subscribe(async response => {
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.notes = this.notes.concat(response.body);
    },
    error => {
    },
    () => {
      this.loading = false;
      event.target.complete();
    });
  }

  /**
   * open popup to update modal
   */
  async add() {

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    let note = new Note;
    note.candidate_id = this.candidate_id;

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note,
        candidate: this.candidate
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
        candidate_id: this.candidate_id
      });
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
