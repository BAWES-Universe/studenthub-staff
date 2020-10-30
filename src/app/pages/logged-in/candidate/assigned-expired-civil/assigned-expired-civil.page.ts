import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
// services
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'app-assigned-expired-civil',
  templateUrl: './assigned-expired-civil.page.html',
  styleUrls: ['./assigned-expired-civil.page.scss'],
})
export class AssignedExpiredCivilPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1; 

  public searchBar = '';

  public form: FormGroup;
  public candidatelistData = [];

  public candidates = [];

  public loading = false;
  public renewLoader: boolean = false;
  
  public checkAll = null;

  constructor(
    public candidateService: CandidateService
  ) {
  }

  ngOnInit() {
    this.loadData(1);
  }

  /**
   * Load expired ID cards
   * @param page
   */
  async loadData(page) {

    if (!this.renewLoader)
      this.loading = true;

    this.candidateService.listAssignedExpiredIds(this.searchBar, page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidatelistData = response.body;
    },
    error => { },
    () => {
      this.renewLoader = false;
      this.loading = false;
    });
  }

  /**
   * load more data on scroll to bottom 
   * @param event 
   */
  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.candidateService.listAssignedExpiredIds(this.searchBar, this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.candidatelistData = this.candidatelistData.concat(response.body);
      },
      error => {
      },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }
}
