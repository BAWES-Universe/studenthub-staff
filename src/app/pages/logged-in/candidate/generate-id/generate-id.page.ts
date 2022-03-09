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

  public loading = false;
  public loadingMore = false;
  public downloading = false;
  public searchBar = '';
  public cndSegment = 'not-generated';
  public candidates: any = [];

  public form: FormGroup;
  public candidatelistData;

  public borderLimit = false;

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

    this._alertCtrl.create({
      header: 'Generate Candidates Ids',
      message: `Do you really want to generate Candidate Ids ?`,
      buttons: [
        {
          text: 'Yes',
          role: 'Yes',
          handler: (blah) => {
            this.downloading = true;

            this.candidateIdCardService.generate(this.candidates).subscribe(response => {
            }, (err) => {
            }, () => {
              this.downloading = false;
            });
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
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

  /**
   * Load candidates whose ID not generated
   */
  async loadNotGenerated(page: number, event = null) {

    this.currentPage = page;

    this.loadingMore = true;

    this.candidateIdCardService.listCandidates(this.searchBar, page).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        if(this.currentPage == 1) {
          this.candidatelistData = response.body;
        } else {
          this.candidatelistData = this.candidatelistData.concat(response.body);
        }

        this.candidates = [];

        this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;
        });

      },
      error => {},
      () => {
        if(event)
          event.target.complete();

        this.loadingMore = false;
      });
  }

  /**
   * Load candidates whose ID generated
   */
  async loadGenerated(page: number, event = null) {

    this.currentPage = page;

    this.loadingMore = true;

    this.candidateIdCardService.listCandidateIds(this.searchBar, page).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        if(this.currentPage == 1) {
          this.candidatelistData = response.body;
        } else {
          this.candidatelistData = this.candidatelistData.concat(response.body);
        }

        this.candidates = [];

        this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;
        });

      },
      error => {},
      () => {
        if(event)
          event.target.complete();

        this.loadingMore = false;
      });
  }

  segmentChanged($ev) {
    if ($ev.detail.value == 'not-generated') {
      this.loadNotGenerated(1);
    } else  {
      this.loadGenerated(1);
    }
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.currentPage++;

    if (this.cndSegment == 'not-generated') {
      this.loadNotGenerated(this.currentPage, event);
    } else {
      this.loadGenerated(this.currentPage, event);
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  redirect(event, obj){
    console.log(event, obj);
  }

}
