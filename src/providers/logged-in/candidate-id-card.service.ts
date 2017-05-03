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
export class CandidateIdCardService {

  private _candidateEndpoint: string = "/candidate-id-cards";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  generate(candidates: any): Observable<any> {
    let url = this._candidateEndpoint + '/generate';
    let params = {
      "candidates": candidates
    };
    return this._authhttp.generateCards(url, params, 'ID-Cards.zip');
  }

  /**
   * List of all candidates whose card not generated, to generate card
   * @returns {Observable<any>}
   */
  listCandidates(): Observable<any> {
    let url = this._candidateEndpoint + '/list-candidates';
    return this._authhttp.get(url);
  }
}
