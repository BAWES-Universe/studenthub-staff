import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
//services
import { EventService } from 'src/app/providers/event.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { TagService } from 'src/app/providers/logged-in/tag.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-candidate-tags',
  templateUrl: './candidate-tags.page.html',
  styleUrls: ['./candidate-tags.page.scss'],
})
export class CandidateTagsPage implements OnInit {

  public borderLimit;
  public loading: boolean = false;
  
  public isLoading: boolean = false;

  public candidate;
  public candidate_id;

  public tags = [];

  public form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public translateService: TranslateLabelService,
    public eventService: EventService,
    public tagService: TagService,
    public candidateService: CandidateService
  ) {
  }

  ngOnInit() {

    if (!this.candidate_id)
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('candidate_id');

    const state = window.history.state;

    if (state && state.candidate) {
      this.candidate = state.candidate;
    }

    if (!this.candidate) {
      this.loadData();
    }

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadData();
    });

    this.loadTags();
  }
 
  loadTags() {
    this.tagService.list().subscribe(res => {
      this.tags = res;

      this.initForm();
    });
  }

  /**
   * load candidate notes without pagination
   */
  loadData() {
    this.loading = true;

    this.candidateService.detail(this.candidate_id).subscribe(response => {

      this.loading = false;

      this.candidate = response;
       
    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  onTagSelected(tag) {
    this.form.controls['tag'].setValue(tag);
    this.form.controls['tag'].updateValueAndValidity();
  }

  initForm() {
    this.form = this.fb.group({
      tag: [null, [Validators.required]],
      reason: [null, [Validators.required]],
      candidate_id: [this.candidate_id, [Validators.required]],
    });
  }

  onSubmit() {
    this.isLoading = true; 
    
    this.candidateService.addTag(this.form.value).subscribe(async res => {

      this.isLoading = false;
    
       if (res.operation == 'success') {
    
        this.loadData();

        this.form.controls['tag'].reset();
        this.form.controls['reason'].reset();

       }
       else if (res.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: ["Okay"]
        });
        prompt.present();
       }
    
     }, error => {
       this.isLoading = false;
     });
  }
}