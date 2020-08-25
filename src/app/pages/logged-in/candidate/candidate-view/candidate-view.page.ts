import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
// models
import { Store } from 'src/app/models/store';
import { Candidate } from 'src/app/models/candidate';
// service
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import {EventService} from "../../../../providers/event.service";
import {AuthService} from "../../../../providers/auth.service";
import {OptionPage} from "../option/option.page";

@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.page.html',
  styleUrls: ['./candidate-view.page.scss'],
})
export class CandidateViewPage implements OnInit {

  public candidate: Candidate;

  public salaryTransfers: any[] = [];

  public stores: Store[];

  public workHistory: any[] = [];

  public candidate_id;

  public sendingPassword: boolean = false;
  public assigning: boolean = false;
  public unassinging: boolean = false;
  public loading: boolean = false;
  public approving: boolean = false;
  public sections = 'personal';
  public processing = null;

  public updatingJobSearchStatus: boolean = false;

  constructor(
    public navCtrl: NavController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public aws: AwsService,
    public toastCtrl: ToastController,
    public eventService: EventService,
    public authService: AuthService,
    public popoverCtrl: PopoverController,
  ) {
    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.eventService.reloadCandidateHistory$.subscribe((res) => {
      this.loadCandidateDetail();
      this.loadWorkHistoryData();
    });

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });
  }

  ionViewDidEnter() {
    // const state = window.history.state;
    // if (state.model) {
    //   this.candidate = state.model;
    // } else  {
    //   this.loadCandidateDetail();
    // }
    this.loadCandidateDetail();
    this.loadWorkHistoryData();

    this.loadStoreData();
    this.loadTransfersData();
  }

  /**
   * Load list of all salary transfers
   */
  loadTransfersData() {
    this.candidateService.transfers(this.candidate_id).subscribe(response => {
      this.salaryTransfers = response;
    });
  }

  /**
   * Load list of all stores then set store name and id as per candidate data
   */
  loadStoreData() {
    this.storeService.list('store_id', 'storeWithCompany').subscribe(response => {
      this.stores = response;
    });
  }

  /**
   * Loads Form in modal to update
   */
  update() {
    this.navCtrl.navigateForward('candidate-form/' + this.candidate.candidate_id, {
      state: {
        model: this.candidate
      }
    });
  }

  /**
   * Assign Candidate to Store
   * @param {number} store_id
   */
  async assignCandidateToStore(store_id: number) {
    this.assigning = true;

    this.candidateService.assignCandidateToStore(this.candidate, store_id).subscribe(async response => {

      this.assigning = false;

      if (response.operation == 'success') {

        this.candidate.store_id = store_id;

        this.loadCandidateDetail();

        this.loadWorkHistoryData();

      } else {
        this.candidate.store_id = null;
        const alert = await this.alertCtrl.create({
          message: this._processResponseMessage(response),
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }

  /**
   * Process the response coming from the server
   * @private
   * @param {any} response
   * @returns message to display in error message
   */
  private _processResponseMessage(response) {
    let html = '';
    if (response.code == 2) {
      for (const i in response.message) {
        for (const j of response.message[i]) {
          html += j + '<br />';
        }
      }
    } else { html = response.message; }

    return html;
  }

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory(this.candidate_id).subscribe(response => {
      this.workHistory = response;
    });
  }

  loadCandidateDetail(loading = true) {
    this.loading = loading;
    this.candidateService.detail(this.candidate_id).subscribe(response => {
      this.loading = false;
      this.candidate = response;
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
  }

  /**
   * Approve the provided model
   */
  async approve(candidate: Candidate) {

    this.approving = true;

    this.candidateService.approve(candidate).subscribe(response => {

      this.approving = false;

      if(response.operation == 'error') {

        this.toastCtrl.create({
          message: this.authService.errorMessage(response.message),
          duration: 3000
        }).then( toast => {
          toast.present();
        });

      } else {
        this.candidate.approved = 1;
        // update review count
        this.eventService.reviewRequired$.next();

        // back to listing
        // this.router.navigate(['/candidate-review-list']);
      }
    });
  }

  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: OptionPage,
      componentProps : {
        candidate: this.candidate
      },
      event: e
    });
    popover.present();
  }

  public segmentChanged($e){
    this.sections = $e.detail.value;
  }

  updateRate($e) {
      this.alertCtrl.create({
        header: 'Set hourly rate',
        inputs: [
          {
            name: 'rate',
            type: 'text',
            placeholder: 'Hourly Rate'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Save',
            handler: (data) => {
              this.processing = 'setting_hours';
              if (data.rate) {
                this.candidateService.updateHour(this.candidate, data.rate).subscribe(response => {

                  this.processing = false;

                  if (response.operation == 'error') {
                    this.toastCtrl.create({
                      message: this.authService.errorMessage(response.message),
                      duration: 3000
                    }).then( toast => {
                      toast.present();
                    });
                  } else {
                    this.loadCandidateDetail(false);
                  }
                });
              }
            }
          }
        ]
      }).then( alert => { alert.present(); });
  }
}
