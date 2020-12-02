import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from 'src/app/models/suggestion';

@Component({
  selector: 'suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit {

  @Input() model: Suggestion;

  constructor(public router: Router) { }

  ngOnInit() {}

  openCandidatePage() {
    if(this.model.candidate) {
      this.router.navigate(['/candidate-view', this.model.candidate_id]);
    } else {
      this.router.navigate(['/fulltimer', this.model.fulltimer.fulltimer_uuid]);
    }
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
}
