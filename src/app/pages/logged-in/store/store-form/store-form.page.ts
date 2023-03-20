import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
// service
import {StoreService} from 'src/app/providers/logged-in/store.service';
import {AuthService} from 'src/app/providers/auth.service';
import {MallService} from 'src/app/providers/logged-in/mall.service';
// model
import {Store} from 'src/app/models/store';
import {Mall} from 'src/app/models/mall';
import {Brand} from "../../../../models/brand";
import {EventService} from "../../../../providers/event.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.page.html',
  styleUrls: ['./store-form.page.scss'],
})
export class StoreFormPage implements OnInit {

  public model: Store = new Store();
  public brands: Brand[];
  public malls: Mall[];
  public operation: string;
  public store_id = null;
  public company_id;
  public form: FormGroup;
  public loading = false;

  public borderLimit = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public storeService: StoreService,
    private _fb: FormBuilder,
    private _modelCtrl: ModalController,
    private _alertCtrl: AlertController,
    public mallService: MallService,
    private authService: AuthService,
    public analyticService: AnalyticsService,
    private eventService: EventService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Store Form Page');

    if(!this.store_id)
      this.store_id = this.activatedRoute.snapshot.paramMap.get('id');

    // Load the passed model if available
    const state = window.history.state;

    if (state.model) {
      this.model = state.model;
    } else {
      this.model.company_id = this.company_id;
    }

    if (state.brands) {
      this.brands = state.brands;
    }

    if (state.malls) {
      this.malls = state.malls;
    }

    if (!this.malls || this.malls.length == 0) {
      this.loadMall();
    }

    this.formInit();
  }

  /**
   * load all mails
   */
  async loadMall() {
    this.mallService.fullList().subscribe(response => {
      this.malls = response;
    });
  }

  formInit() {
    // Init Form

    if (!this.model || !this.model.store_id) { // Show Create Form
      this.operation = 'Add Store';
      this.form = this._fb.group({
        name: ['', Validators.required],
        location: ['', Validators.required],
        brand: [''],
        mall: ['']
      });
    }else{ // Show Update Form
      this.operation = 'Edit Store';
      this.form = this._fb.group({
        name: [this.model.store_name, Validators.required],
        location: [this.model.store_location, Validators.required],
        brand: [this.model.brand_uuid],
        mall: [this.model.mall_uuid]
      });
    }
  }
  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    if(!this.model) {
      this.model = new Store;
    }

    this.model.store_name = this.form.value.name;
    this.model.store_location = this.form.value.location;
    this.model.brand_uuid = this.form.value.brand || null;
    this.model.mall_uuid = this.form.value.mall || null;
  }

  /**
   * Close the page
   */
  close() {
    this._modelCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: false });
      }
    })
  }

  /**
   * Save the model
   */
  async save(){
    this.loading = true;

    this.updateModelDataFromForm();

    let action;

    if (!this.model.store_id) // Create
    {
      action = this.storeService.create(this.model);
    }
    else // Update
    {
      action = this.storeService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){
        // Close the page
        const data = { refresh: true };
        this._modelCtrl.dismiss(data);

        this.eventService.reloadStats$.next({
          company_id: this.model.company_id
        });
      }

      // On Failure
      if (jsonResponse.operation == 'error'){
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
