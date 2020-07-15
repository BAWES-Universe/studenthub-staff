import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertController, NavController, ToastController} from '@ionic/angular';

// models
import {Candidate} from 'src/app/models/candidate';
// service
import {CandidateService} from 'src/app/providers/logged-in/candidate.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.page.html',
  styleUrls: ['./candidate-list.page.scss'],
})
export class CandidateListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public assignedSearchBar = '';
  public unassignedSearchBar = '';
  public cndSegment = 'assigned';
  public candidates: Candidate[];
  public loading = false;
  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public candidateService: CandidateService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
    // to open specific tab
    const segment = this.activatedRoute.snapshot.paramMap.get('segment');
    if (segment) {
      this.cndSegment = segment;
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData(this.currentPage);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    if (this.cndSegment == 'not-assigned') {
      this.loadNotAssigned(page, this.unassignedSearchBar);
    } else {
      this.loadAssigned(page, this.assignedSearchBar);
    }
  }

  /**
   * load unassigned data
   * @param page
   * @param search
   */
  async loadNotAssigned(page: number, search: string) {

    this.currentPage = page;

    // Load list of candidates
    this.loading = true;
    this.candidateService.listNotAssigned(search, page).subscribe(response => {

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

        this.candidates = response.body;
      },
      error => {},
      () => {
        // console.log('Not Assigned Request Completed');
        this.loading = false;
      }
    );
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
    this.candidateService.listAssigned(search, page).subscribe(response => {

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

        this.candidates = response.body;
      },
      error => {},
      () => { console.log('Assigned Request Completed'); this.loading = false; }
    );
  }

  pageLinkColor(page: number) {

    if (page == this.currentPage) {
      return 'light';
    }

    return '';
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state : {
        model
      }
    });
  }

  /**
   * Loads the create page
   */
  create() {
    this.navCtrl.navigateForward('candidate-form');
  }

  /**
   * Delete the provided model
   */

  async delete(candidate: Candidate) {
    const confirm = await this.alertCtrl.create({
      header: 'Delete Candidate?',
      message: 'Are you sure you want to delete this Candidate?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            this.loading = true;
            this.candidateService.delete(candidate).subscribe(async jsonResp => {
              this.loading = false;

              if (jsonResp.operation == 'error') {
                const alert = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  subHeader: jsonResp.message,
                  buttons: ['OK']
                });
                alert.present();
              }

              if (jsonResp.operation == 'success') {
                const toast = await this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();
              }
              this.search();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            // this.search();
          }
        }
      ]
    });
    confirm.present();
  }

  loadSegment($event) {
    this.cndSegment = $event.detail.value;
    if ($event.detail.value == 'assigned') {
      this.loadAssigned(1, this.assignedSearchBar);
    } else if ($event.detail.value == 'not-assigned') {
      this.loadNotAssigned(1, this.unassignedSearchBar);
    }
  }
}

