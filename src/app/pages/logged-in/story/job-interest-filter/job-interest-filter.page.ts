import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Area } from 'src/app/models/area';
import { Country } from 'src/app/models/country';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CountryService } from 'src/app/providers/logged-in/country.service';
import { JobService } from 'src/app/providers/logged-in/job.service';

@Component({
  selector: 'app-job-interest-filter',
  templateUrl: './job-interest-filter.page.html',
  styleUrls: ['./job-interest-filter.page.scss'],
})
export class JobInterestFilterPage implements OnInit {

  public form: FormGroup;

  public interestFilter : {
    country_id: number,
    skills: string[],
    areas: Area[],
    age: {
      from: number,
      to: number
    },
    nationality_countries: Country[],
    gender: number,
  };

  public borderLimit;

  public job_uuid;
  public skills = [];
  public areas: Area[]= [];
  public countrylistData: Country[] = [];

  public minAge = 18;
  public maxAge = 65;
  
  public showNationalityOptions: boolean = false;
  public showLocationOptions: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    public authService: AuthService,
    public jobService: JobService,
    public countryService: CountryService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Job Interest Filter Page');

    this.loadData();

    this.form = this.fb.group({
      country_id: [this.interestFilter.country_id],
      nationality_countries: [this.interestFilter.nationality_countries || []],
      gender: [this.interestFilter.gender],
      age_to: [this.interestFilter.age.to],
      age_from: [this.interestFilter.age.from],
      skills: [this.interestFilter.skills || []],
      areas: [this.interestFilter.areas || []]
    });
  }

  loadData() {
    this.jobService.listInterestFilter(this.job_uuid).subscribe(response => {
      this.countrylistData = response.nationalities;//
      this.skills = response.skills;
      this.areas = response.areas;
    });
  }

  /**
   * Load list of countries
   *
  loadCountryList() {
    this.countryService.listAll().subscribe(response => {
      this.countrylistData = response;
    });
  }*/

  toggleLocationOptions() {
    this.showLocationOptions = !this.showLocationOptions;
  }

  toggleNationalityOptions() {
    this.showNationalityOptions = !this.showNationalityOptions;
  }

  reset() {
    this.form.controls['country_id'].setValue(null);
    this.form.controls['nationality_countries'].setValue([]);
    this.form.controls['gender'].setValue(null);
    this.form.controls['age_to'].setValue(null);
    this.form.controls['age_from'].setValue(null);
    this.form.controls['skills'].setValue([]);
    this.form.controls['areas'].setValue([]);

    this.form.updateValueAndValidity();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onAgeChange(event) {
    this.form.controls['age_from'].setValue(event.detail.value.lower);
    this.form.controls['age_to'].setValue(event.detail.value.upper);

    this.form.controls.age_from.updateValueAndValidity();
    this.form.controls.age_to.updateValueAndValidity();
  }

  setSkills(skills = []) {
    this.form.controls.skills.setValue(skills);
    this.form.controls.skills.updateValueAndValidity();
  }

  removeNationality(country_id, event) {
    event.stopPropagation();
    this.form.controls.nationality_countries.setValue(
      this.form.controls.nationality_countries.value.filter(o => o.country_id !== country_id));
  }

  isAreaSelected(area) {
    const a = this.form.controls.areas.value.find(o => o.area_uuid == area.area_uuid);
    return a;
  }
  
  isNationalitySelected(country) {
    return this.form.controls.nationality_countries.value.find(o => o.country_id == country.country_id);
  }

  removeArea(area_uuid, event) {
    event.stopPropagation();
    this.form.controls.areas.setValue(this.form.controls.areas.value.filter(o => o.area_uuid !== area_uuid));
    this.form.controls.areas.updateValueAndValidity();
  }

  toggleArea(area, event) {
    event.stopPropagation();
    event.preventDefault();

    //if (this.isAreaSelected(area)) {
   // setTimeout(() => {
      if (event.detail.checked) {
        if (!this.isAreaSelected(area)) 
          this.form.controls.areas.setValue([...this.form.controls.areas.value, area]);
      } else {
        this.form.controls.areas.setValue(this.form.controls.areas.value.filter(o => o.area_uuid !== area.area_uuid));
      }
      this.form.controls.areas.updateValueAndValidity();
   // }, 200)

  }

  toggleNationality(country, event) {
    event.stopPropagation();
    event.preventDefault();
    
    //if (this.isNationalitySelected(country)) {
    //setTimeout(() => {
      if (event.detail.checked) {  
        if (!this.isNationalitySelected(country)) 
          this.form.controls.nationality_countries.setValue([...this.form.controls.nationality_countries.value, country]);
      } else {
        this.form.controls.nationality_countries.setValue(this.form.controls.nationality_countries.value.filter(o => o.country_id !== country.country_id));
      }
      this.form.controls.nationality_countries.updateValueAndValidity();
    //}, 200);
  }

  toggleSkill(skill) {
    if (this.form.controls.skills.value.includes(skill)) {
      this.form.controls.skills.setValue(this.form.controls.skills.value.filter(o => o !== skill));
    } else {
      this.form.controls.skills.setValue([...this.form.controls.skills.value, skill]);
    }
    this.form.controls.skills.updateValueAndValidity();
  }

  filter() {
    let filter = this.form.value;
    filter.age = {
      from: this.form.value.age_from,
      to: this.form.value.age_to
    };

    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: true, interestFilter: filter });
      }
    });
  }

  /**
   * Close the page
   */
  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: false });
      }
    });
  }
}
