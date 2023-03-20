import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
// models
import { Suggestion } from 'src/app/models/suggestion';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { Note } from 'src/app/models/note';
// services
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { NoteService } from '../../../../providers/logged-in/note.service';
import {FulltimerService} from "../../../../providers/logged-in/fulltimer.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-fulltimer-suggestions',
  templateUrl: './fulltimer-suggestions.page.html',
  styleUrls: ['./fulltimer-suggestions.page.scss'],
})
export class FulltimerSuggestionsPage implements OnInit {

  public borderLimit;
  public loading = false;
  public fulltimer_uuid;
  public status; // 1:Suggested, 2:Rejected, 3:Accepted
  public notes: Note[] = [];

  public fulltimer;

  public suggestions: Suggestion[] = [];

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public fulltimerService: FulltimerService,
    public suggestionService: SuggestionService,
    public analyticService: AnalyticsService,
    public noteService: NoteService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Fulltimer Suggestions Page');

    if (!this.fulltimer_uuid) {
      this.fulltimer_uuid = this.activatedRoute.snapshot.paramMap.get('id');
    }

    console.log(this.fulltimer_uuid);

    if (!this.status) {
      this.status = this.activatedRoute.snapshot.paramMap.get('status');
    }

    const state = window.history.state;

    if (state && state.fulltimer) {
      this.fulltimer = state.fulltimer;
    }

    if (!this.fulltimer) {
      this.loadCandidateDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data.fulltimer_uuid == this.fulltimer_uuid) {
        this.loadSuggestions();
      }
    });

    this.loadSuggestions();
  }

  loadCandidateDetail(loading = true) {
    this.loading = loading;
    this.fulltimerService.view(this.fulltimer).subscribe(response => {
      this.loading = false;
      this.fulltimer = response;
    });
  }

  /**
   * load candidate notes without pagination
   */
  loadSuggestions() {
    this.suggestionService
      .listAll('&fulltimer_uuid=' + this.fulltimer_uuid + '&status=' + this.status)
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
    const params = '&fulltimer=' + this.fulltimer;

    this.noteService.list(params).subscribe(async jsonResponse => {
      this.notes = jsonResponse;
    });
  }
}
