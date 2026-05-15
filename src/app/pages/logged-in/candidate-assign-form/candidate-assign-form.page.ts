import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'src/app/util/date-fns';
//models
import { Contract } from 'src/app/models/contract';
//services
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { StoreService } from 'src/app/providers/logged-in/store.service';


@Component({
  selector: 'app-candidate-assign-form',
  templateUrl: './candidate-assign-form.page.html',
  styleUrls: ['./candidate-assign-form.page.scss'],
})
export class CandidateAssignFormPage implements OnInit {
  
  public candidate_id;
  public store_id; 
  
  public form: FormGroup;

  public todayDate;
  public maxDate;
  
  public borderLimit = false;

  public tab = 'contract';

  public contracts: Contract[];

  constructor(
    private _fb: FormBuilder,
    private storeService: StoreService,
    private candidateService: CandidateService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.setDates();
    this.candidateService.getTransferCostAtCompanyLevel(this.candidate_id, this.store_id).subscribe(res => {
      this.initForm(res);
      //this.contracts = res.contracts;
    });

    this.storeService.contracts(this.store_id).subscribe(res => {
      this.contracts = res;
    })
  }

  initForm(res = null) {
    this.form = this._fb.group({
      rate: [''],
      company_hourly_rate: [''],
      company_transfer_cost: [res?.transfer_cost],
      transfer_cost: [''],
      contract_uuid: [null, Validators.required],
      start_date: [this.todayDate, Validators.required],
    });

    //todo: validation based on contract selection?

  }

  segmentChanged(event) {
    this.tab = event.target.value;
    
    if (this.tab == "legacy") {
      this.form.get("contract_uuid").setValue(null);
      this.form.get("contract_uuid").setValidators(null)
      this.form.get("contract_uuid").updateValueAndValidity();

      this.form.get("rate").setValue(null);
      this.form.get("rate").setValidators(Validators.required)
      this.form.get("rate").updateValueAndValidity();
    } else {
      this.form.get("contract_uuid").setValue(null);
      this.form.get("contract_uuid").setValidators(Validators.required)
      this.form.get("contract_uuid").updateValueAndValidity();

      this.form.get("rate").setValue(null);
      this.form.get("rate").setValidators(null)
      this.form.get("rate").updateValueAndValidity();
    }
  }

  /**
   * Sets the default dates for min/max validation
   */
  setDates() {
    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.todayDate = new Date().toISOString();
    this.maxDate = new Date((yyyy + 1), mm).toISOString();
  }

  save() {
    let params = this.form.value;
    params.start_date = format(parseISO(this.form.controls['start_date'].value), 'yyyy-MM-dd HH:mm:ss');//, { timeZone: '+3:30' }
    this.modalCtrl.dismiss(params);
  }

  close() {
    this.modalCtrl.dismiss();
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
