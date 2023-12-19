import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AlertController, ModalController, NavController} from '@ionic/angular';
// models
import { Invitation } from 'src/app/models/invitation';
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
// services
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import {SuggestionService} from "../../../../providers/logged-in/suggestion.service";
import {AuthService} from "../../../../providers/auth.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-candidate-invitations',
  templateUrl: './candidate-invitations.page.html',
  styleUrls: ['./candidate-invitations.page.scss'],
})
export class CandidateInvitationsPage implements OnInit {

  public borderLimit;

  public loading = false;

  public loadingInvitations = false; 

  public candidate_id;

  public status; // 1:Invited, 2:Rejected, 3:Accepted

  public candidate;

  public invitations: Invitation[] = [];

  public currentPage; 
  public total; 
  public pageCount; 

  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public eventService: EventService,
    public candidateService: CandidateService,
    public invitationService: InvitationService,
    public suggestionService: SuggestionService,
    public analyticService: AnalyticsService,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {

    this.analyticService.page('Candidate Invitations Page');

    if (!this.candidate_id) {
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');
    }

    if (!this.status) {
      this.status = this.activatedRoute.snapshot.paramMap.get('status');
    }

    const state = window.history.state;

    if (state && state.candidate) {
      this.candidate = state.candidate;
    }

    if (!this.candidate) {
      this.loadCandidateDetail();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.eventService.invitationUpdated$.subscribe((data: any) => {
      if (data.candidate_id == this.candidate_id) {
        this.loadInvitations();
      }
    });

    this.loadInvitations();
  }

  /**
   * @param loading 
   */
  loadCandidateDetail(loading = true) {

    this.loading = loading;
    
    this.candidateService.detail(this.candidate_id).subscribe(response => {
      this.loading = false;
      this.candidate = response;
    });
  }

  /**
   * load candidate invitations without pagination
   */
  loadInvitations() {

    this.loadingInvitations = true; 

    const urlParams = '?expand=request,request.company,request.storyOwners,request.staff,request.staffs' 
      +'&candidate_id=' + this.candidate_id + '&status=' + this.status;

    this.invitationService.listWithPagination(urlParams).subscribe(async jsonResponse => {
      this.invitations = jsonResponse.body;

      this.pageCount = parseInt(jsonResponse.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(jsonResponse.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(jsonResponse.headers.get('X-Pagination-Total-Count'));

      this.loadingInvitations = false; 
    });
  }

  /**
   * load more on scroll to bottom 
   * @param event 
   */
  async doInfinite(event) {
 
    this.loadingInvitations = true; 

    this.currentPage++;

    const urlParams = '?expand=request,request.company,request.storyOwners,request.staff,request.staffs' 
      +'&candidate_id=' + this.candidate_id + '&status=' + this.status + '&page=' + this.currentPage;
    
    this.invitationService.listWithPagination(urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.invitations = this.invitations.concat(response.body);

    }, () => { },
    () => { 
      event.target.complete();
      this.loadingInvitations = false; 
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * save suggestion
   */
  suggest(invitation: Invitation) {

    if (invitation.is_suggested) {
      return false;
    }

    this.loading = true;

    const param = {
      suggestion: 'Candidate Suggestion',
      request_uuid: invitation.request_uuid,
      fulltimer_uuid: null,
      candidate_id: invitation.candidate_id
    };

    this.suggestionService.create(param).subscribe(async response => {

      this.loading = false;
      invitation.is_suggested = true;

      // On Success
      if (response.operation == 'success') {
        const prompt = await this.alertCtrl.create({
          message: 'Suggested successfully',
          buttons: ['Okay']
        });
        prompt.present();
      }

      // On Failure
      if (response.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * open request detail page
   * @param request
   */
  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-dashboard'
      }
    });
  }
}
