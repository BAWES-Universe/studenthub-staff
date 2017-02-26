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
  list(): Observable<any>{
    let url = this._candidateEndpoint;
    return this._authhttp.get(url);
  }

  /**
   * Create
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  create(model: Candidate): Observable<any>{
    let postUrl = `${this._candidateEndpoint}`;
    let params = {
      "name": model.candidate_name,
      "email": model.candidate_email,
      "password": model.candidate_password_hash,
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  update(model: Candidate): Observable<any>{
    let url = `${this._candidateEndpoint}/${model.candidate_id}`;
    let params = {
      "name": model.candidate_name,
      "email": model.candidate_email
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Delete
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  delete(model: Candidate): Observable<any>{
    let url = `${this._candidateEndpoint}/${model.candidate_id}`;
    return this._authhttp.delete(url);
  }


}
