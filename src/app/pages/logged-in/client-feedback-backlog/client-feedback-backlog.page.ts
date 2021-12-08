import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
//models
import { Suggestion } from '../../../models/suggestion';
//services
import { SuggestionService } from '../../../providers/logged-in/suggestion.service';


@Component({
  selector: 'app-client-feedback-backlog',
  templateUrl: './client-feedback-backlog.page.html',
  styleUrls: ['./client-feedback-backlog.page.scss'],
})
export class ClientFeedbackBacklogPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public suggestions: Suggestion[] = [];

  public company = null;
  public loading = false;
  public borderLimit = false;

  constructor(
    public suggestionService: SuggestionService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  /**
   * load candidate suggestions for this request
   */
   loadData() {

    this.suggestionService.list().subscribe(data => {

      this.suggestions = data;
    });
  }

  onSuggestionUpdate() {
    this.loadData();
    this.content.scrollToPoint(0, 0);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }

  update() {

  }
}
