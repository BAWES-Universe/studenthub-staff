import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { AlertController, ModalController, Platform, IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { Plugins } from '@capacitor/core';
// services
// import { JobService } from 'src/app/services/logged-in/job.service';
// import { CvBuilderService } from 'src/app/services/logged-in/cvbuilder.service';
// import { CityService } from 'src/app/services/logged-in/city.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { TranslateLabelService } from 'src/app/services/translate-label.service';
// import { GoogleMapService } from 'src/app/services/logged-in/google-map.service';
// models
// import { City } from 'src/app/models/city';
import { Area } from 'src/app/models/area';
import { Candidate } from 'src/app/models/candidate';
import {GoogleMapService} from '../../../../providers/logged-in/google-map.service';
import {AuthService} from '../../../../providers/auth.service';
import {TranslateLabelService} from '../../../../providers/translate-label.service';
import {Country} from '../../../../models/country';
import {Fulltimer} from "../../../../models/fulltimer";


const { Geolocation } = Plugins;

@Component({
  selector: 'app-fulltime-location',
  templateUrl: './fulltime-location.page.html',
  styleUrls: ['./fulltime-location.page.scss'],
})
export class FulltimeLocationPage implements OnInit {

  public from = 'sign-up';

  @ViewChild('searchInput', { static: false }) myInput;

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition = 0;

  public query: string;

  public places = [];
  public recentPlaces = [];

  public loading = false;

  public updatingLocation = false;
  public fulltimer: Fulltimer;

  public isReady = false;

  public map; // : google.maps.Map;
  public marker;

  public area;
  public country;
  public country_name;
  public latitude;
  public longitude;

  public selected = false;
  public isLoading = false;

  @ViewChild('searchInput', { static: false }) searchInput;


  public getItemSubscription: Subscription;
  public placeSelectedSubscription: Subscription;
  public cityByLocationSubscription: Subscription;
  public getLocationByIpSubscription: Subscription;
  public isCityExistSubscription: Subscription;
  public updateLocationSubscription: Subscription;

  public borderLimit = false;

  constructor(
    public router: Router,
    public platform: Platform,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public _modalCtrl: ModalController,
    // public jobService: JobService,
    // public cvBuilderService: CvBuilderService,
    // public cityService: CityService,
    public googleMapService: GoogleMapService,
    public authService: AuthService,
    // public storage: Storage,
    public translateService: TranslateLabelService,
    public zone: NgZone
  ) {
  }

  async ngOnInit() {

    if (!this.from) {
      this.from = this.activatedRoute.snapshot.paramMap.get('from');
    }
    if (
      this.fulltimer &&
      this.fulltimer.area &&
      this.fulltimer.area.area_name_en &&
      this.fulltimer.country &&
      this.fulltimer.country.country_name_en
    ) {
      this.area = this.fulltimer.area;
      this.country = this.fulltimer.country;
      this.country_name = this.fulltimer.country.country_name_en;
      this.selected = true;
    }

  }

  ngOnDestroy() {
    if (!!this.getItemSubscription) {
      this.getItemSubscription.unsubscribe();
    }

    if (!!this.placeSelectedSubscription) {
      this.placeSelectedSubscription.unsubscribe();
    }

    if (!!this.cityByLocationSubscription) {
      this.cityByLocationSubscription.unsubscribe();
    }

    if (!!this.getLocationByIpSubscription) {
      this.getLocationByIpSubscription.unsubscribe();
    }

    if (!!this.isCityExistSubscription) {
      this.isCityExistSubscription.unsubscribe();
    }

    if (!!this.updateLocationSubscription) {
      this.updateLocationSubscription.unsubscribe();
    }
  }

  onCountryChange(event) {
    this.area = null;
    this.query = null;

    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.setFocus();
      }
    }, 500);
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  ionViewWillEnter() {

    // https://www.pivotaltracker.com/story/show/170180935

    this.isReady = false;

    setTimeout(() => {
      this.isReady = true;
    }, 200);

    // if (this.cvBuilderService.candidate) {
    //   this.candidate = JSON.parse(JSON.stringify(this.cvBuilderService.candidate));
    //   this._setQuery();
    // }
    //
    // if (!this.cvBuilderService.candidate) {
    //
    //   this.cvBuilderService.loadData().then(_ => {
    //
    //     this.candidate = JSON.parse(JSON.stringify(this.cvBuilderService.candidate));
    //
    //     this._setQuery();
    //   });
    // }

    this.loading = false;

    setTimeout(() => {
      if (this.myInput) {
        this.myInput.setFocus();
      }
    }, 50);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  /**
   * Set query parameter by city
   */
  _setQuery() {
    // if (!this.candidate.city) {
    //   this.candidate.city = new City;
    // }
    //
    // if (this.candidate.city) {
    //   this.query = this.translateService.langContent(this.candidate.city.city_name_en, this.candidate.city.city_name_ar);
    // }
  }

  /**
   * Hide focus on scroll
   * @param ev
   */
  onScroll(ev) {
    this.myInput.setBlur();
  }

  /**
   * Return search result
   * @param ev
   */
  async getItems(ev: any) {

    this.query = ev.target.value;

    if (!this.query || this.query.length == 0) {
      this.places = [];
      return;
    }

    this.getItemSubscription = this.googleMapService.getPlacePredictions(this.query, this.country_name)
      .subscribe(result => {
      if (!result || result.length == 0) {
        return null;
      }

      this.places = [];

      const a = [];

      // political
      for (const i of result) {

        if (i.types.indexOf('country') > -1) {
          continue;
        }

        // to avoid duplicate

        const b = i.structured_formatting.main_text + i.terms[i.terms.length - 1].value;

        if (a.indexOf(b) > -1) {
          continue;
        }

        a.push(b);

        // show place to user

        this.places.push(i);
      }
    });
  }

  /**
   * Place selected from search result
   * @param place
   */
  placeSelected(place) {

    const ok = this.translateService.transform('Okay');

    this.isLoading = true;

    this.googleMapService.placeDetail(place).subscribe(result => {

      this.isLoading = false;

      if (result.operation == 'success') {
        this.setArea(result.country, result.area, result.area.area_latitude, result.area.area_longitude);
      }
      else
      {
        this.alertCtrl.create({
          message: this.translateService.errorMessage(result.message),
          buttons: [ok]
        }).then(alert => alert.present());
      }
    }, () => {
      this.isLoading = false;
    });
  }

  setArea(country, area, latitude, longitude) {

    if (!country || !area) {
      return null;
    }

    // save changes

    this.dismiss({
      area_uuid: area.area_uuid,
      country_id: country.country_id,
      latitude,
      longitude,
      area,
      country
    });
  }

  /**
   * on search cancel remove search result
   */
  onCancel() {
    this.places = [];
  }

  /**
   * Place selected from search result
   * @param place
   */
  // placeSelected(place) {
  //
  //   const ok = this.translateService.transform('Okay');
  //
  //   this.loading = true;
  //
  //   this.placeSelectedSubscription = this.googleMapService.placeDetail(place).subscribe(result => {
  //
  //     if (result.operation == 'success') {
  //       this.citySelected(result.city, result.area);
  //     } else {
  //       this.loading = false;
  //
  //       this.alertCtrl.create({
  //         message: this.translateService.errorMessage(result.message),
  //         buttons: [ok]
  //       }).then(alert => alert.present());
  //     }
  //   }, () => {
  //     this.loading = false;
  //   });
  // }

  /**
   * On city selected
   * @param city
   * @param area
   */
  // async citySelected(city: City, area: Area = null) {
  //
  //   this.candidate.city = city;
  //   this.candidate.city_uuid = city.city_uuid;
  //   this.candidate.latitude = city.city_latitude;
  //   this.candidate.longitude = city.city_longitude;
  //   this.candidate.country = city.country;
  //
  //   if (area) {
  //     this.candidate.area = area;
  //     this.candidate.area_uuid = area.area_uuid;
  //   } else {
  //     this.candidate.area = null;
  //     this.candidate.area_uuid = null;
  //   }
  //
  //   this._setQuery(); // update query
  //
  //   if(this.from == 'sidebar') {
  //     this.updateLocation();
  //   } else {
  //     this.loading = false;
  //   }
  // }

  /**
   * on recent place selection
   */
  // async recentPlaceSelected(place) {
  //
  //   this.candidate.latitude = place.city.city_latitude;
  //   this.candidate.longitude = place.city.city_longitude;
  //   this.candidate.city = place.city;
  //   this.candidate.city_uuid = place.city.city_uuid;
  //   this.candidate.country = place.city.country;
  //
  //   if (place.area) {
  //     this.candidate.area = place.area;
  //     this.candidate.area.area_uuid = place.area.area_uuid;
  //   } else {
  //     this.candidate.area = null;
  //     this.candidate.area_uuid = null;
  //   }
  //
  //   if(this.from == 'sidebar') {
  //     this.updateLocation();
  //   } else {
  //     this.loading = false;
  //   }
  // }

  /**
   * Get city by geolocation
   * @param latitude
   * @param longitude
   */
  // async cityByLocation(latitude, longitude) {
  //   const ok = this.translateService.transform('ok');
  //
  //   this.loading = true;
  //
  //   this.cityByLocationSubscription = this.cityService.cityByLocation(latitude, longitude).subscribe(result => {
  //
  //     if (result.operation == 'success') {
  //
  //       this.candidate.latitude = result.city.city_latitude;
  //       this.candidate.longitude = result.city.city_longitude;
  //       this.candidate.city = result.city;
  //       this.candidate.city_uuid = result.city.city_uuid;
  //       this.candidate.country = result.city.country;
  //
  //       //this.authService.currentLocation.city = result.city.city_name_en;
  //       //this.authService.currentLocation.country_name = result.city.country.country_name;
  //       //this.authService.currentLocation.lo = result.city.country.country_name;
  //
  //       if (result.area) {
  //         this.candidate.area = result.area;
  //         this.candidate.area_uuid = result.area.area_uuid;
  //       } else {
  //         this.candidate.area = null;
  //         this.candidate.area_uuid = null;
  //       }
  //
  //       if(this.from == 'sidebar') {
  //         this.updateLocation();
  //       } else {
  //         this.loading = false;
  //       }
  //
  //     } else {
  //
  //       this.loading = false;
  //
  //       this.alertCtrl.create({
  //         header: result.message,
  //         buttons: [ok]
  //       }).then(alert => alert.present());
  //     }
  //   }, _ => {
  //     this.loading = false;
  //   });
  // }

  /**
   * Get location
   */
  // async getLocation() {
  //
  //   this.loading = true;
  //
  //   const locationOptions = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };
  //
  //   Geolocation.getCurrentPosition(locationOptions).then((resp) => {
  //     if (resp && resp.coords) {
  //       this.storage.set('location-permission', true).then(() => {// we have permission
  //         this.cityByLocation(resp.coords.latitude, resp.coords.longitude);
  //       });
  //     } else {
  //       this.getLocationByIp();
  //     }
  //   }).catch((error) => {
  //     this.storage.set('location-permission', false).then(() => {
  //       this.getLocationByIp();
  //     });
  //   });
  // }

  /**
   * Get geolocation by ip
   */
  // async getLocationByIp() {
  //   this.loading = true;
  //
  //   this.getLocationByIpSubscription = this.authService.locate().subscribe(result => {
  //     this.isCityExist(result);
  //   });
  // }

  /**
   * Check if city exists in our service area
   * @param result
   */
  // async isCityExist(result) {
  //   this.loading = true;
  //
  //   let action;
  //
  //   if (result.city.length > 0) {
  //     action = this.cityService.isExist(result);
  //   } else {
  //     action = this.cityService.cityByLocation(result.latitude, result.longitude, result.zip);
  //   }
  //
  //   this.isCityExistSubscription = action.subscribe(response => {
  //
  //     if (response.operation == 'success') {
  //       this.candidate.latitude = result.latitude;
  //       this.candidate.longitude = result.longitude;
  //       this.candidate.city = response.city;
  //       this.candidate.city_uuid = response.city.city_uuid;
  //       this.candidate.country = response.city.country;
  //
  //       if (response.area) {
  //         this.candidate.area = response.area;
  //         this.candidate.area.area_uuid = response.area.area_uuid;
  //       } else {
  //         this.candidate.area = null;
  //         this.candidate.area_uuid = null;
  //       }
  //
  //       if (this.from == 'sidebar') {
  //         this.updateLocation();
  //       } else {
  //         this.loading = false;
  //       }
  //     }
  //     else
  //     {
  //       this.loading = false;
  //
  //       this.alertCtrl.create({
  //         message: response.message,
  //         buttons: [this.translateService.transform('Okay')]
  //       }).then(prompt => prompt.present());
  //     }
  //   }, _ => {
  //     this.loading = false;
  //   });
  // }

  /**
   * Update candidate's location
   */
  // async updateLocation() {
  //   const error = this.translateService.transform('Error updating location');
  //   const ok = this.translateService.transform('ok');
  //
  //   this.updatingLocation = true;
  //
  //   this.updateLocationSubscription = this.cvBuilderService.updateLocation(this.candidate).subscribe(response => {
  //
  //     this.updatingLocation = false;
  //     this.loading = false;
  //
  //     if (response.operation == 'success') {
  //       this.next();
  //     } else {
  //       this.alertCtrl.create({
  //         message: error,
  //         buttons: [ok]
  //       }).then(prompt => prompt.present());
  //     }
  //   }, () => {
  //     this.updatingLocation = false;
  //     this.loading = false;
  //   });
  // }

  /**
   * Goto next page
   */
  // async next() {
  //   // check if recent places available
  //
  //   const city = this.candidate.city;
  //   const area = this.candidate.area;
  //
  //   if (!this.recentPlaces) {
  //     this.recentPlaces = [];
  //   }
  //
  //   // to save last 5 places, remove extra from front
  //
  //   if (this.recentPlaces.length > 5) {
  //     this.recentPlaces = this.recentPlaces.slice(this.recentPlaces.length - 5, this.recentPlaces.length - 1);
  //   }
  //
  //   // remove if already added
  //
  //   const places = [];
  //   for (const i in this.recentPlaces) {
  //     if (
  //
  //       // if city not match, add else if area not match, add
  //
  //       (
  //         this.recentPlaces[i].city &&
  //         this.recentPlaces[i].city.city_uuid != city.city_uuid
  //       )
  //       ||
  //       (
  //         area &&
  //         this.recentPlaces[i].area &&
  //         this.recentPlaces[i].area.area_uuid != area.area_uuid
  //       )
  //     ) {
  //       places.push(this.recentPlaces[i]);
  //     }
  //   }
  //
  //   places.push({
  //     city: city,
  //     area: this.candidate.area
  //   });
  //
  //   this.storage.set('recent-places', places).then(_ => {
  //     this.nextPage();
  //   });
  // }

  /**
   * set location available in authService by ip
   */
  // setCurrentLocation() {
  //   this.isCityExist(this.authService.currentLocation);
  // }

  /**
   * clear current selection
   */
  clear() {
    this.query = null;
    this.latitude = null;
    this.area = null;
    this.longitude = null;
    this.country = null;
    this.selected = false;
  }

  dismiss(data = {}) {
    this._modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this._modalCtrl.dismiss(data);
      }
    });
  }

  highlight(item) {

    if (!this.query) {
      return item;
    }

    const reg = new RegExp(this.query, 'gi');

    return item.replace(reg, str => {
      return '<b>' + str + '</b>';
    });
  }

  /**
   * Goto next step
   */
  // nextPage() {
  //
  //   if (this.from == 'sidebar') {
  //     this.dismiss();
  //   } else {
  //     this.cvBuilderService.nextIncompleteTask('location', this.from);
  //   }
  // }
}
