import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
//model
import { Store } from "../../../../models/store";
import { Candidate } from "../../../../models/candidate";
//page
import { StoreFormPage } from "../store-form/store-form.page";
//service
import { StoreService } from "../../../../providers/logged-in/store.service";
import { AwsService } from 'src/app/providers/aws.service';
import {EventService} from "../../../../providers/event.service";
import {MallService} from "../../../../providers/logged-in/mall.service";
import {Mall} from "../../../../models/mall";


@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.page.html',
  styleUrls: ['./store-view.page.scss'],
})
export class StoreViewPage implements OnInit {

  public store: Store;
  public store_id = null;
  public loading = false;
  public malls: Mall[];

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    public aws: AwsService,
    private _storeService: StoreService,
    private eventService: EventService,
    private mallService: MallService
  ) {
  }

  ngOnInit() {
    this.store_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    // if (state['model']) {
    //   this.store = state['model'];
    // } else {
    this.loadData();
    this.loadMall();
    // }
    this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData();
    });
  }

  /**
   * On candidate selected from list
   */
  candidateSelected(candidate: Candidate) {
    this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
      state: {
        model: candidate
      }
    });
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this._modalCtrl.create({
      component: StoreFormPage,
      componentProps: {
        model: this.store,
        brands: this.store.company.brands,
        malls: this.malls
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });

    return await modal.present();
  }

  loadData() {
    this.loading = true;
    this._storeService.detail(this.store_id).subscribe(response => {
      this.loading = false;
      this.store = response;
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
  }

  /**
   * load all mails
   */
  async loadMall() {
    this.mallService.fullList().subscribe(response => {
      this.malls = response;
    });
  }
}
