import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

//services
import {AuthhttpService} from "./authhttp.service";

//model
import {Candidate} from "src/app/models/candidate";
import {Country} from "src/app/models/country";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthhttpService) { }

  /**
   * candidate detail
   * @returns {Observable<any>}
   */
  detail(id:number): Observable<any> {
    return this._authhttp.get(this._candidateEndpoint + '/detail/' + id);
  }

  /**
   * candidate salary transfer list
   * @returns {Observable<any>}
   */
  transfers(id:number): Observable<any> {
    let url = this._candidateEndpoint + '/transfers/' + id;
    return this._authhttp.get(url);
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = this._candidateEndpoint;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates asigned to store
   * @returns {Observable<any>}
   */
  listAssigned(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/assigned?candidate_name=' + candidate_name + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates not asigned to store
   * @returns {Observable<any>}
   */
  listNotAssigned(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/not-assigned?candidate_name=' + candidate_name + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * Create
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  create(model: Candidate): Observable<any> {
    let postUrl = `${this._candidateEndpoint}`;
    let params = {
      "candidate_id": model.candidate_id,
      "store_id": model.store_id,
      "bank_id": model.bank_id,
      "university_id": model.university_id,
      "country_id": model.country_id,
      "bank_account_name": model.bank_account_name,
      "iban": model.candidate_iban,
      "name": model.candidate_name,
      "name_ar": model.candidate_name_ar,
      "personal_photo": model.candidate_personal_photo,
      "email": model.candidate_email,
      "phone": model.candidate_phone,
      "birth_date": model.candidate_birth_date,
      "civil_id": model.candidate_civil_id,
      "expiry_date": model.candidate_civil_expiry_date,
      "photo_front": model.candidate_civil_photo_front,
      "photo_back": model.candidate_civil_photo_back,
      "hourly_rate": model.candidate_hourly_rate,
      "candidate_status": model.candidate_status
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  update(model: Candidate): Observable<any> {
    let url = `${this._candidateEndpoint}/${model.candidate_id}`;
    let params = {
      "candidate_id": model.candidate_id,
      "store_id": model.store_id,
      "university_id": model.university_id,
      "country_id": model.country_id,
      "bank_id": model.bank_id,
      "bank_account_name": model.bank_account_name,
      "iban": model.candidate_iban,
      "name": model.candidate_name,
      "name_ar": model.candidate_name_ar,
      "personal_photo": model.candidate_personal_photo,
      "email": model.candidate_email,
      "phone": model.candidate_phone,
      "birth_date": model.candidate_birth_date,
      "civil_id": model.candidate_civil_id,
      "expiry_date": model.candidate_civil_expiry_date,
      "photo_front": model.candidate_civil_photo_front,
      "photo_back": model.candidate_civil_photo_back,
      "hourly_rate": model.candidate_hourly_rate,
      "candidate_status": model.candidate_status
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Reset Password
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  resetPassword(model: Candidate): Observable<any> {
    let url = `${this._candidateEndpoint}/reset-password/${model.candidate_id}`;
    return this._authhttp.patch(url, {});
  }

  /**
   * Delete candidate
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  delete(model: Candidate): Observable<any> {
    let url = `${this._candidateEndpoint}/${model.candidate_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Removes Candidate from Assigned store
   * @param {any} candidate
   * @returns {Observable<any>}
   */
  removeFromAssignedStore(candidate: Candidate): Observable<any> {
    let url = `${this._candidateEndpoint}/unassign/${candidate.candidate_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Assign candidate to store
   * @param {Candidate} candidate
   * @param {number} store_id
   * @returns {Observable<any>}
   */
  assignCandidateToStore(candidate: Candidate, store_id:number): Observable<any> {
    let params = {
      "store_id": store_id
    };
    let url = `${this._candidateEndpoint}/assign/${candidate.candidate_id}`;
    return this._authhttp.patch(url, params);
  }

  /**
   * List candidates by country
   * @param country
   * @param page
   */
  listByCountry(country: Country, page: number): Observable<any>{
    let url = this._candidateEndpoint + '/search?country_id=' + country.country_id + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * return work history
   * @param candidate
   */
  workHistory(candidate_id): Observable<any> {
    let url = this._candidateEndpoint +'/work-history/'+ candidate_id;
    return this._authhttp.get(url);
  }
}
