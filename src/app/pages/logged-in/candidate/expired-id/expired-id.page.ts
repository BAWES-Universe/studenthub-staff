import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
// services
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-expired-id',
  templateUrl: './expired-id.page.html',
  styleUrls: ['./expired-id.page.scss'],
})
export class ExpiredIdPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public searchBar = '';

  public form: FormGroup;
  public candidatelistData = [];

  public candidates = [];

  public loading = false;
  public renewLoader: boolean = false;
  
  public checkAll = null;

  constructor(
    public candidateIdCardService: CandidateIdCardService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    private _events: EventService,
    private _nav: NavController
  ) {
  }

  ngOnInit() {

    this.form = this._fb.group({
      candidates: [],
    });

    this.loadData(1);

    this._events.reloadCandidateHistory$.subscribe(e => {
      this.loadData(1);
    });
  }

  /**
   * Renew id cards
   */
  async renew() {

    if (this.candidates.length == 0) {
      const prompt = await this._alertCtrl.create({
        message: 'Please select candidate(s)',
        buttons: ['Ok']
      });
      prompt.present();
      return false;
    }

    this.renewLoader = true;

    this.candidateIdCardService.renew(this.candidates).subscribe(jsonResponse => {

      this.candidates = [];

      // refresh list
      this.currentPage = 1;
      this.loadData(this.currentPage);

      this._events.expiredIdCard$.next();
    }, () => {
      this.renewLoader = false;
    });
  }

  onCandidateToggle(event) {
    let candidate_id = event.target.value;

    if(event.detail.checked) {
      this.candidates.push(candidate_id);
    } else {
      this.candidates = this.candidates.filter(c => c != candidate_id);
    }
  }

  /**
   * current page link
   * @param page
   */
  pageLinkColor(page: number) {

    if (page == this.currentPage) {
      return 'light';
    }

    return '';
  }

  /**
   * Load expired ID cards
   * @param page
   */
  async loadData(page) {

    // Load list of candidates
    if (!this.renewLoader)
      this.loading = true;

    this.candidateIdCardService.listExpiredIds(this.searchBar, page).subscribe(response => {
      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for (let i = 1; i <= this.pageCount; i++) {
        this.pages.push(i);
      }

      // hide if no page = 1

      if (this.pageCount == 1) {
        this.pages = [];
      }

      this.candidatelistData = response.body;
    },
      error => { },
      () => {
        this.renewLoader = false;
        this.loading = false;
      });
  }

  doInfinite(event) {
    this.loading = true;

    this.currentPage++;
    this.candidateIdCardService.listExpiredIds(this.searchBar, this.currentPage).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

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
  detail(obj) {
    this._nav.navigateForward('candidate-view/' + obj.candidate_id);
  }

  selectAll() {
    this.checkAll = !(this.checkAll);
  }
}
