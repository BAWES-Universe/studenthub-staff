import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Candidate } from '../../models/candidate';

/**
 * Manages Candidate Functionality on the server
 */
@Injectable()
export class CandidateService {

  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthHttpService) { }

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
      "email": model.candidate_email,
      "password": model.candidate_password_hash,
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
      "email": model.candidate_email,
      "password": model.candidate_password_hash,
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
   * Delete
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  delete(model: Candidate): Observable<any> {
    let url = `${this._candidateEndpoint}/${model.candidate_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Delete
   * @param {any} candidate_id
   * @returns {Observable<any>}
   */
  unAssignCandidate(candidate_id: any): Observable<any> { 
   let url = `${this._candidateEndpoint}/unassign/${candidate_id}`;
      return this._authhttp.delete(url);
  }


  /**
   * PATCH
   * @param {number} candidate_id
   * @param {number} store_id
   * @returns {Observable<any>}
   */
  assignCandidate(candidate_id: number,store_id:number): Observable<any> {
    let params = {
      "store_id": store_id
    };
    let url = `${this._candidateEndpoint}/assign/${candidate_id}`;
    return this._authhttp.patch(url, params);
  }

  listByCountry(country_id: number, page: number): Observable<any>{
    let url = this._candidateEndpoint + '/search?country_id=' + country_id + '&page=' + page;
    return this._authhttp.getRaw(url);
  }
}
