import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//models
import { Suggestion } from 'src/app/models/suggestion';
//services
import { AwsService } from 'src/app/providers/aws.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';


@Component({
  selector: 'app-suggestion-view',
  templateUrl: './suggestion-view.page.html',
  styleUrls: ['./suggestion-view.page.scss'],
})
export class SuggestionViewPage implements OnInit {

  public suggestion_uuid: string;

  public suggestion: Suggestion;

  public loading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public aws: AwsService,
    public suggestionService: SuggestionService
  ) { }

  ngOnInit() {
    if(!this.suggestion_uuid)
      this.suggestion_uuid = this.route.snapshot.params.suggestion_uuid;
      
    this.loadData();
  }

  /**
   * load suggestion detail
   */
  loadData() {
    this.loading = true;

    this.suggestionService.view(this.suggestion_uuid).subscribe(data => {
      this.suggestion = data;

      this.loading = false;
    });
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
