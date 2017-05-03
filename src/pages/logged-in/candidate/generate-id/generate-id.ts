import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Providers
import { CandidateIdCardService } from '../../../../providers/logged-in/candidate-id-card.service';

@Component({
  selector: 'page-generate-id',
  templateUrl: 'generate-id.html'
})
export class GenerateIdPage {

  public candidates: any = [];
  
  public form: FormGroup;
  public candidatelistData;
  
  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public candidateIdCardService: CandidateIdCardService,
    private _fb: FormBuilder,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController
  ) {
    
      this.form = this._fb.group({
        candidates: [],
      });
  }

  ionViewDidLoad() {

    //let loader = this._loadingCtrl.create();
    //loader.present();

    // Load the all available bank list
    this.loadCandidates();

    //loader.dismiss();
  }

  /**
   * Generate id cards
   */
  generate() {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateIdCardService.generate(this.candidates).subscribe(jsonResponse => {
      loader.dismiss();
    });
  }

  loadCandidates() {
    this.candidateIdCardService.listCandidates().subscribe(response => {
      this.candidatelistData = response;

      this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;  
        });
    });
  }
}
