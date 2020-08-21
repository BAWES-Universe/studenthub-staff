import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';


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

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
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
      this.candidateIdCardService.candidates = [];
    });
  }

  ionViewWillEnter() {
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
   * load assigned user data
   * @param page
   * @param search
   */
  async loadAssigned(page: number, search: string) {

    this.currentPage = page;

    // Load list of candidates
    this.loading = true;
    this.candidateService.listAssigned(search, page, 1).subscribe(response => {

      this.totalCount = response.headers.get('X-Pagination-Total-Count');
      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

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

  doInfinite(event, type) {
    this.paginationLoading = true;
    this.currentPage ++;
    this.candidateService.listAssigned(this.SearchBar, this.currentPage, 1).subscribe(response => {
        this.paginationLoading = false;
        this.totalCount = response.headers.get('X-Pagination-Total-Count');
        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.candidates = this.candidates.concat(response.body);
      },
      error => { },
      () => { event.target.complete(); }
    );
  }
}

