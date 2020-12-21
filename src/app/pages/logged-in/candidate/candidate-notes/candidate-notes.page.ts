import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//models
import { Note } from 'src/app/models/note';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
//services
import { NoteService } from 'src/app/providers/logged-in/note.service';


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
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
    public noteService: NoteService
  ) { 
  }

  ngOnInit() {

    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');

    const state = window.history.state;

    if(state && state.candidate) {
      this.candidate = state.candidate;
    } else {
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
} 
