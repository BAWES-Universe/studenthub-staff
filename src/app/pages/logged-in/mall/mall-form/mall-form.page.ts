import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, ModalController} from '@ionic/angular';

// service
import {MallService} from 'src/app/providers/logged-in/mall.service';
// model
import {Mall} from 'src/app/models/mall';
import {AuthService} from "../../../../providers/auth.service";

@Component({
  selector: 'app-mall-form',
  templateUrl: './mall-form.page.html',
  styleUrls: ['./mall-form.page.scss'],
})
export class MallFormPage implements OnInit {

  public model: Mall = new Mall();
  public brands: any = [];
  public operation: string;
  public mallUUID = null;
  public form: FormGroup;
  public loading = false;

  public borderLimit = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public mallService: MallService,
    private fb: FormBuilder,
    private modelCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ){
    this.mallUUID = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    // Load the passed model if available
    const state = window.history.state;
    if (state.model) {
      this.model = state.model;
    }

    this.formInit();
  }

  formInit() {
    // Init Form
    if (!this.model.mall_uuid){ // Show Create Form
      this.operation = 'Create';
      this.form = this.fb.group({
        name_en: ['', Validators.required],
        name_ar: ['', Validators.required]
      });
    }else{ // Show Update Form
      this.operation = 'Update';
      this.form = this.fb.group({
        name_en: [this.model.mall_name_en, Validators.required],
        name_ar: [this.model.mall_name_ar, Validators.required],
      });
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.mall_name_en = this.form.value.name_en;
    this.model.mall_name_ar = this.form.value.name_ar;
  }

  /**
   * Close the page
   */
  close(refresh = false){
    const data = { refresh };
    this.modelCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save(){
    this.loading = true;

    this.updateModelDataFromForm();

    let action;
    if (!this.model.mall_uuid){
      // Create
      action = this.mallService.create(this.model);
    }else{
      // Update
      action = this.mallService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){
        // Close the page
        this.close(true);
      }

      // On Failure
      if (jsonResponse.operation == 'error'){
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
