import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { Fulltimer } from 'src/app/models/fulltimer';
// Services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class FulltimerService {

  public algoliaConfig;

  private _fulltimerEndpoint = '/fulltimers';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * load fulltimer detail
   * @param fulltimer_uuid
   */
  view(fulltimer_uuid, urlParams: string = '') {
    const url = this._fulltimerEndpoint + '/' + fulltimer_uuid + urlParams
    return this._authhttp.get(url);
  }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    const url = this._fulltimerEndpoint + '?page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * Create Fulltimer
   * @param {Fulltimer} model
   * @returns {Observable<any>}
   */
  create(model: Fulltimer): Observable<any>{
    const postUrl = `${this._fulltimerEndpoint}`;

    const params = {
      nationality_id: model.nationality_id,
      area_uuid: model.fulltimer_area_uuid,
      country_id: model.country_id,
      latitude: model.fulltimer_latitude,
      longitude: model.fulltimer_longitude,
      name: model.fulltimer_name,
      phone: model.fulltimer_phone,
      email: model.fulltimer_email,
      pdf_cv: model.fulltimer_pdf_cv,
      current_salary: model.fulltimer_current_salary,
      expected_salary: model.fulltimer_expected_salary,
      currency_code: model.currency_code,
      university_id: model.university_id,
      employed: model.fulltimer_employed,
      gender: model.fulltimer_gender,
      driving_license: model.fulltimer_driving_license,
      birth_date: model.fulltimer_birth_date,
      tags: model.fulltimerTags
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update Fulltimer
   * @param {Fulltimer} model
   * @returns {Observable<any>}
   */
  update(model: Fulltimer): Observable<any>{
    const url = `${this._fulltimerEndpoint}/${model.fulltimer_uuid}`;

    const params = {
      nationality_id: model.nationality_id,
      area_uuid: model.fulltimer_area_uuid,
      country_id: model.country_id,
      latitude: model.fulltimer_latitude,
      longitude: model.fulltimer_longitude,
      name: model.fulltimer_name,
      phone: model.fulltimer_phone,
      email: model.fulltimer_email,
      pdf_cv: model.fulltimer_pdf_cv,
      current_salary: model.fulltimer_current_salary,
      expected_salary: model.fulltimer_expected_salary,
      currency_code: model.currency_code,
      university_id: model.university_id,
      employed: model.fulltimer_employed,
      gender: model.fulltimer_gender,
      driving_license: model.fulltimer_driving_license,
      birth_date: model.fulltimer_birth_date,
      tags: model.fulltimerTags
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Delete Fulltimer
   * @param {Fulltimer} model
   * @returns {Observable<any>}
   */
  delete(model: Fulltimer): Observable<any>{
    const url = `${this._fulltimerEndpoint}/${model.fulltimer_uuid}`;
    return this._authhttp.delete(url);
  }
}
