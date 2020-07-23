import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
// service
import {StoreService} from 'src/app/providers/logged-in/store.service';
// model
import {Store} from 'src/app/models/store';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.page.html',
  styleUrls: ['./store-form.page.scss'],
})
export class StoreFormPage implements OnInit {

  public model: Store = new Store();
  public operation: string;
  public store_id = null;
  public company_id;
  public form: FormGroup;
  public loading = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public storeService: StoreService,
    private _fb: FormBuilder,
    private _modelCtrl: ModalController,
    private _alertCtrl: AlertController
  ){
    this.store_id = this.activatedRoute.snapshot.paramMap.get('id');

  }

  ngOnInit() {

    // Load the passed model if available
    const state = window.history.state;
    if (state.model) {
      this.model = state.model;
    } else {
      this.model.company_id = this.company_id;
    }
    this.formInit();
  }

  formInit() {
    // Init Form
    if (!this.model.store_id){ // Show Create Form
      this.operation = 'Create';
      this.form = this._fb.group({
        name: ['', Validators.required]
      });
    }else{ // Show Update Form
      this.operation = 'Update';
      this.form = this._fb.group({
        name: [this.model.store_name, Validators.required]
      });
    }
  }
  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.store_name = this.form.value.name;
  }

  /**
   * Close the page
   */
  close(){
    const data = { refresh: false };
    this._modelCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save(){
    this.loading = true;

    this.updateModelDataFromForm();

    let action;
    if (!this.model.store_id){
      // Create
      action = this.storeService.create(this.model);
    }else{
      // Update
      action = this.storeService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){
        // Close the page
        const data = { refresh: true };
        this._modelCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == 'error'){
        const prompt = await this._alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }
}
