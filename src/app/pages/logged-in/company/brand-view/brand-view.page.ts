import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// model
import { Candidate } from 'src/app/models/candidate';
import { Brand } from 'src/app/models/brand';
import { Store } from 'src/app/models/store';
// service
import { AwsService } from 'src/app/providers/aws.service';
import { BrandService } from 'src/app/providers/logged-in/brand.service';


@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.page.html',
  styleUrls: ['./brand-view.page.scss'],
})
export class BrandViewPage implements OnInit {

  public brand: Brand;
  public brandID = null;
  public loading = false;

  public borderLimit = false;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    public aws: AwsService,
    private brandService: BrandService,
  ) {
  }

  ngOnInit() {
    this.brandID = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadData();
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
   * store selected
   * @param store
   */
  storeSelected(store: Store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id, {
      state: {
        model: store
      }
    });
  }

  /**
   * load brand view
   */
  loadData() {
    this.loading = true;
    this.brandService.view(this.brandID).subscribe(response => {
      this.loading = false;
      this.brand = response;
    });
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
