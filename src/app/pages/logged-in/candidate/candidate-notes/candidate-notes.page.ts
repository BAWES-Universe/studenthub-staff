import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
//models
import { Note } from 'src/app/models/note';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
//services
import { NoteService } from 'src/app/providers/logged-in/note.service';
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

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
    public noteService: NoteService
  ) {
  }

  ngOnInit() {

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
    });
  }

  /**
   * load candidate notes without pagination
   */
  loadNotes() {
    const params = '&candidate_id=' + this.candidate_id;

    this.noteService.list(params).subscribe(async jsonResponse => {
      this.notes = jsonResponse;
    });
  }

  /**
   * open popup to update modal
   */
  async add() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    let note = new Note;
    note.candidate_id = this.candidate_id;
    
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
