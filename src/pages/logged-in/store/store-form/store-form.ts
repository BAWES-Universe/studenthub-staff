import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Providers
import { StoreService } from '../../../../providers/logged-in/store.service';
// Models
import { Store } from '../../../../models/store';

@Component({
  selector: 'page-store-form',
  templateUrl: 'store-form.html'
})
export class StoreFormPage {

  public model: Store;
  public operation:string;

  public form: FormGroup;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public storeService: StoreService,
    private _fb: FormBuilder,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController
  ){
    // Load the passed model if available
    this.model = params.get('model');

    // Init Form
    if(!this.model.store_id){ // Show Create Form
      this.operation = "Create";
      this.form = this._fb.group({
        name: ["", Validators.required]
      });
    }else{ // Show Update Form
      this.operation = "Update";
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
    let data = { 'refresh': false };
    this._viewCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  save(){
    let loader = this._loadingCtrl.create();
    loader.present();

    this.updateModelDataFromForm();

    let action;
    if(!this.model.store_id){
      // Create
      action = this.storeService.create(this.model);
    }else{
      // Update
      action = this.storeService.update(this.model);
    }

    action.subscribe(jsonResponse => {
      loader.dismiss();

      // On Success
      if(jsonResponse.operation == "success"){
        // Close the page
        let data = { 'refresh': true };
        this._viewCtrl.dismiss(data);
      }

      // On Failure
      if(jsonResponse.operation == "error"){
        let prompt = this._alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }
}