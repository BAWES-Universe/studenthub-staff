import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-incomplete-candidate-list',
  templateUrl: './incomplete-candidate-list.page.html',
  styleUrls: ['./incomplete-candidate-list.page.scss'],
})
export class IncompleteCandidateListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public pages: number[] = [];

  public SearchBar = '';
  public candidates: Candidate[];

  public loading: boolean = false;
  public paginationLoading = false;
  public downloading: boolean = false;

  public borderLimit = false;

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
    public eventService: EventService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
  }

  ngOnInit() {
  }

  /**
   * Generate id cards
   */
  async generate() {

    if (this.candidateIdCardService.candidates.length == 0)
    {
      const prompt = await this.alertCtrl.create({
        message: 'Please select candidate(s)',
        buttons: ['Ok']
      });
      prompt.present();

      return false;
    }

    this.downloading = true;

    this.candidateIdCardService.generate(this.candidateIdCardService.candidates).subscribe(response => {
    }, (err) => {
    }, () => {
      this.downloading = false;
      this.deselect();
    });
  }

  deselect() {
    this.candidateService.candidates = [];
    this.candidateIdCardService.candidates = [];

    this.eventService.clearCandidateSelection$.next();
  }

  ionViewWillEnter() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    this.loadAssigned(page, this.SearchBar);
  }

  /**
   * load assigned and incomplete profile
   * @param page
   * @param search
   */
  async loadAssigned(page: number, search: string) {

    this.currentPage = page;

    this.loading = true;

    this.candidateService.listAssigned(search, page, 1).subscribe(response => {

      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidates = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * Loads the create page
   */
  create() {
    this.navCtrl.navigateForward('candidate-form');
  }

  doInfinite(event) {

    this.paginationLoading = true;

    this.currentPage ++;

    this.candidateService.listAssigned(this.SearchBar, this.currentPage, 1).subscribe(response => {

        this.paginationLoading = false;
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.candidates = this.candidates.concat(response.body);
      },
      error => { },
      () => { event.target.complete(); }
    );
  }
  
  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}

