import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';

// services
import {CandidateIdCardService} from 'src/app/providers/logged-in/candidate.id.card.service';
import {EventService} from 'src/app/providers/event.service';

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
  public candidates: any = [];

  public form: FormGroup;
  public candidatelistData;
  public loading = false;
  constructor(
    public candidateIdCardService: CandidateIdCardService,
    private _fb: FormBuilder,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _events: EventService
  ) {
    this.form = this._fb.group({
      candidates: [],
    });
  }

  ngOnInit() {
    this.loadData(this.currentPage);
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

    this.loading = true;

    this.candidateIdCardService.renew(this.candidates).subscribe(jsonResponse => {
      this.loading = false;

      // refresh list
      this.currentPage = 1;
      this.loadData(this.currentPage);

      this._events.expiredIdCard$.next();
    });
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
    this.loading = true;

    this.candidateIdCardService.listExpiredIds(this.searchBar, page).subscribe(response => {
        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.pages = [];

        for (let i = 1; i <= this.pageCount; i++){
          this.pages.push(i);
        }

        // hide if no page = 1

        if (this.pageCount == 1) {
          this.pages = [];
        }

        this.candidatelistData = response.body;

        this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;
        });
      },
      error => {},
      () => {this.loading = false; }
    );
  }
}
