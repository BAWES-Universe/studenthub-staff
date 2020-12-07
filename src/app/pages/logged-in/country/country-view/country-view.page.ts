import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
// service
import {CandidateService} from 'src/app/providers/logged-in/candidate.service';
import {CountryService} from 'src/app/providers/logged-in/country.service';
import {AwsService} from 'src/app/providers/aws.service';
// models
import {Country} from 'src/app/models/country';
import {Candidate} from 'src/app/models/candidate';


@Component({
  selector: 'app-country-view',
  templateUrl: './country-view.page.html',
  styleUrls: ['./country-view.page.scss'],
})
export class CountryViewPage implements OnInit {

  public borderLimit = false; 
  
  public pageCount = 0;
  public currentPage = 1;
 
  public loading = true;
  public loadingDetail = false;
  public deletingCandidate = false;

  public country: Country;
  public candidates: Candidate[];
  public country_id;

  constructor(
    public navCtrl: NavController,
    private candidateService: CandidateService,
    private countryService: CountryService,
    public activatedRoute: ActivatedRoute,
    public aws: AwsService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
  }

  ngOnInit() {

    this.country_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    const state = window.history.state;

    if (state.model) {
      this.country = state.model;
    }

    if (this.country) {
      this.loadData(this.currentPage);
    } else  {
      this.countryView(this.country_id);
    }
  }

  refresh() {
    this.currentPage = 1;
    this.loadData(1);
  }

  /**
   * load country detail
   * @param page 
   */
  async loadData(page: number) {
    
    // Load list of candidates
    
    this.loading = true;

    this.candidateService.listByCountry(this.country, page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.candidates = response.body;

      this.loading = false;
    });
  }

  candidateSelected(candidate) {
    // Load Detail Page
    this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
      state : {
        model: candidate
      }
    });
  }

  /**
   * country view
   * @param country_id
   */
  async countryView(country_id) {
    this.loadingDetail = true;
    this.countryService.view(country_id).subscribe(response => {
      this.loadingDetail = false;
      this.country = response;
      this.loadData(this.currentPage);
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
