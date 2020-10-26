import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// services
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
// models
import { Candidate } from 'src/app/models/candidate';


@Component({
  selector: 'app-candidate-review-list',
  templateUrl: './candidate-review-list.page.html',
  styleUrls: ['./candidate-review-list.page.scss'],
})
export class CandidateReviewListPage implements OnInit {

  public loading = false;

  public total = 0;
  public pageCount = 0;
  public currentPage = 1;

  public candidates: Candidate[] = [];

  constructor(
    public router: Router,
    public aws: AwsService,
    public candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  /**
   * Load Candidate List
   * @param page
   */
  async loadData(page: number) {

    this.loading = true;

    this.candidateService.listToReview(page).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.candidates = response.body;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.candidateService.listToReview(this.currentPage).subscribe(response => {

      this.loading = false;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      
      this.candidates = this.candidates.concat(response.body);

      event.target.complete();

    }, () => {
      this.loading = false;
    });
  }

  /**
   * When a candidate is selected
   * @param model
   */
  rowSelected(model) {

    this.router.navigate(['/candidate-view', model.candidate_id], {
      state: {
        model: model
      }
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
  }
}
