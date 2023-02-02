import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, ModalController, NavController} from '@ionic/angular';

// service
import {MallService} from 'src/app/providers/logged-in/mall.service';
// model
import {AuthService} from "../../../../providers/auth.service";
import {Expense} from "../../../../models/expense";
import {ExpenseService} from "../../../../providers/logged-in/expense.service";

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.page.html',
  styleUrls: ['./expense-form.page.scss'],
})
export class ExpenseFormPage implements OnInit {

  public model: Expense = new Expense();
  public brands: any = [];
  public operation: string;
  public mallUUID = null;
  public form: FormGroup;
  public loading = false;

  public borderLimit = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public expenseService: ExpenseService,
    private fb: FormBuilder,
    private modelCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    window.analytics.page('Mall Form Page');

    if(!this.mallUUID)
      this.mallUUID = this.activatedRoute.snapshot.paramMap.get('id');

    // Load the passed model if available
    const state = window.history.state;
    if (state.model) {
      this.model = state.model;
    }

    this.formInit();
  }

  formInit() {
    // Init Form
    if (!this.model.staff_expense_uuid){ // Show Create Form
      this.operation = 'Create';
      this.form = this.fb.group({
        supplier: ['', Validators.required],
        category: ['', Validators.required],
        purchase_date: ['', Validators.required],
        total_amount: ['', Validators.required],
        currency: [''],
        vat: [''],
        reimbursable: [''],
        description: [''],
        file: [''],
      });
    }else{ // Show Update Form
      this.operation = 'Update';
      this.form = this.fb.group({
        supplier: ['', Validators.required],
        category: ['', Validators.required],
        purchase_date: ['', Validators.required],
        total_amount: ['', Validators.required],
        currency: [''],
        vat: [''],
        reimbursable: [''],
        description: [''],
        file: [''],
      });
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.supplier = this.form.value.supplier;
    this.model.category = this.form.value.category;
    this.model.purchase_date = this.form.value.purchase_date;
    this.model.total_amount = this.form.value.total_amount;
    this.model.currency = this.form.value.currency;
    this.model.vat = this.form.value.vat;
    this.model.reimbursable = this.form.value.reimbursable;
    this.model.description = this.form.value.description;
    this.model.file = this.form.value.file;
  }

  /**
   * Close the page
   */
  close(refresh = false){
    const data = { refresh };
    this.modelCtrl.getTop().then(e => {
      if (e) {
        this.modelCtrl.dismiss(data);
      } else {
        this.navCtrl.back();
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
    if (!this.model.staff_expense_uuid){
      // Create
      action = this.expenseService.create(this.model);
    }else{
      // Update
      action = this.expenseService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){

        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();

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
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
