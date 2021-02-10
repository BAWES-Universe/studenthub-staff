import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
// models
import { Suggestion } from 'src/app/models/suggestion';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
// services
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import {NoteService} from '../../../../providers/logged-in/note.service';
import {Note} from 'src/app/models/note';

@Component({
  selector: 'app-candidate-suggestions',
  templateUrl: './candidate-suggestions.page.html',
  styleUrls: ['./candidate-suggestions.page.scss'],
})
export class CandidateSuggestionsPage implements OnInit {

  public borderLimit;
  public loading = false;
  public candidate_id;
  public status; // 1:Suggested, 2:Rejected, 3:Accepted
  public notes: Note[] = [];

  public candidate;
  public suggestions: Suggestion[] = [];
  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
    public suggestionService: SuggestionService,
    public noteService: NoteService
  ) {
  }

  ngOnInit() {

    if (!this.candidate_id) {
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');
    }

    if (!this.status) {
      this.status = this.activatedRoute.snapshot.paramMap.get('status');
    }

    const state = window.history.state;

    if (state && state.candidate) {
      this.candidate = state.candidate;
    }

    if (!this.candidate) {
      this.loadCandidateDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data.candidate_id == this.candidate_id) {
        this.loadSuggestions();
      }
    });

    this.loadSuggestions();
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
  loadSuggestions() {
    this.suggestionService
      .list('&candidate_id=' + this.candidate_id + '&status=' + this.status)
      .subscribe(async jsonResponse => {
        this.suggestions = jsonResponse;
      });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
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

}
