import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { Request } from 'src/app/models/request';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
// services
import { CompanyRequestService } from '../../../providers/logged-in/company-request.service';


@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  public borderLimit = false;

  public loadingRequests = false;

  public loading = false;

  public candidate: Candidate;

  public activeRequests: Request[] = [];
  public activeRequestsData: Request[] = [];

  public form: FormGroup;
  public query;

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public invitationService: InvitationService,
    public requestService: CompanyRequestService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadRequests();
  }

  initForm() {

    this.form = this.fb.group({
      request_uuid: ['', Validators.required],
      candidate_id: [this.candidate ? this.candidate.candidate_id : null],
      reason: ['', Validators.required],
    });
  }

  async selectRequest(request) {
      const confirm = await this.alertCtrl.create({
        header: 'Please provide feedback',
        inputs: [
          {
            name: 'feedback',
            type: 'textarea',
            placeholder: 'Reason'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // Handle the functionality when user click on 'cancel' button
            }
          },
          {
            text: 'Ok',
            handler: async (data) => {
              this.form.controls.reason.setValue(data.feedback);
              this.form.controls.request_uuid.setValue(request.request_uuid);
              this.form.controls.request_uuid.markAsDirty();
              this.save();
            }
          }
        ]
      });
      confirm.present();
  }

  /**
   * load all requests for parttimers
   */
  loadRequests() {
    this.loadingRequests = true;

    this.requestService.listActiveRequests().subscribe(data => {

      this.loadingRequests = false;

      this.activeRequests = data;
      this.activeRequestsData = data;
    }, () => {
      this.loadingRequests = false;
    });
  }

  onSearchInput(ev: any) {
    this.query = ev.target.value;

    this.activeRequestsData = this.activeRequests.filter(item => {
      return (
        (item.company && item.company.company_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1) ||
        (item.company && item.company.company_common_name_en && item.company.company_common_name_en.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1) ||
        (item.company && item.company.company_common_name_ar && item.company.company_common_name_ar.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1) || 
        item.request_position_title.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
        item.request_job_description.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 
      );
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    return (date) ? new Date(date.replace(/-/g, '/')) : null;
  }

  /**
   * save suggestion
   */
  save() {
    this.loading = true;

    this.invitationService.create(this.form.value).subscribe(async response => {

      this.loading = false;

      // On Success
      if (response.operation == 'success') {
        // Close the page
        this.close(true, response.invitedCount);
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
   * close popup
   * @param refresh
   * @param invitedCount
   */
  close(refresh = false, invitedCount = null) {
    this.modalCtrl.dismiss({
      refresh,
      invitedCount
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
