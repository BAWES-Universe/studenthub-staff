import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { Fulltimer } from 'src/app/models/fulltimer';
import { Request } from 'src/app/models/request';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
// services
import { CompanyRequestService } from '../../../providers/logged-in/company-request.service';


@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.page.html',
  styleUrls: ['./suggest.page.scss'],
})
export class SuggestPage implements OnInit {

  public borderLimit = false;

  public loadingRequests = false;

  public loading = false;

  public candidate: Candidate;

  public fulltimer: Fulltimer;

  public activeRequests: Request[] = [];

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public suggestionService: SuggestionService,
    public requestService: CompanyRequestService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadRequests();
  }

  initForm() {

    this.form = this.fb.group({
      suggestion: ['', Validators.required],
      request_uuid: ['', Validators.required],
      fulltimer_uuid: [this.fulltimer ? this.fulltimer.fulltimer_uuid : null],
      candidate_id: [this.candidate ? this.candidate.candidate_id : null],
    });
  }

  selectRequest(request) {
    this.form.controls.request_uuid.setValue(request.request_uuid);
    this.form.controls.request_uuid.markAsDirty();
  }

  /**
   * load all requests
   */
  loadRequests() {
    this.loadingRequests = true;

    this.requestService.listActiveRequests().subscribe(data => {
      this.loadingRequests = false;

      this.activeRequests = data;
    }, () => {
      this.loadingRequests = false;
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

    this.suggestionService.create(this.form.value).subscribe(async response => {
      
      this.loading = false;

      // On Success
      if (response.operation == 'success') {
        // Close the page
        this.close(true, response.suggestionCount);
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
   * @param suggestionCount
   */
  close(refresh = false, suggestionCount = null) {
    this.modalCtrl.dismiss({
      refresh, suggestionCount
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
