import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertController} from '@ionic/angular';
// service
import {CandidateIdCardService} from 'src/app/providers/logged-in/candidate.id.card.service';

@Component({
  selector: 'app-generate-id',
  templateUrl: './generate-id.page.html',
  styleUrls: ['./generate-id.page.scss'],
})
export class GenerateIdPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public loading = false;
  public downloading = false;
  public searchBar = '';
  public cndSegment = 'not-generated';
  public candidates: any = [];

  public form: FormGroup;
  public candidatelistData;

  constructor(
    public candidateIdCardService: CandidateIdCardService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController
  ) {
    this.form = this._fb.group({
      candidates: [],
    });
  }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  /**
   * Generate id cards
   */
  async generate() {

    if (this.candidates.length == 0)
    {
      const prompt = await this._alertCtrl.create({
        message: 'Please select candidate(s)',
        buttons: ['Ok']
      });
      prompt.present();

      return false;
    }

    this.downloading = true;

    this.candidateIdCardService.generate(this.candidates).subscribe(response => {
    }, (err) => {
    }, () => {
      this.downloading = false;
    });
  }

  /**
   * search method
   */
  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  /**
   * load data
   * @param page
   */
  loadData(page: number) {
    if (this.cndSegment == 'not-generated') {
      this.loadNotGenerated(page);
    } else {
      this.loadGenerated(page);
    }
  }

  pageLinkColor(page: number) {

    if (page == this.currentPage) {
      return 'light';
    }

    return '';
  }

  /**
   * Load candidates whose ID not generated
   */
  async loadNotGenerated(page: number) {

    this.currentPage = page;

    // Load list of candidates
    this.loading = true;

    this.candidateIdCardService.listCandidates(this.searchBar, page).subscribe(response => {

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

        this.candidates = [];

        this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;
        });

      },
      error => {},
      () => {this.loading = false; }
    );
  }

  /**
   * Load candidates whose ID generated
   */
  async loadGenerated(page: number) {

    this.currentPage = page;

    // Load list of candidates
    this.loading = true;

    this.candidateIdCardService.listCandidateIds(this.searchBar, page).subscribe(response => {
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

        this.candidates = [];

        this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;
        });

      },
      error => {},
      () => {this.loading = false; }
    );
  }

  segmentChanged($ev) {
    if ($ev.detail.value == 'not-generated') {
      this.loadNotGenerated(1);
    } else  {
      this.loadGenerated(1);
    }
  }
}
