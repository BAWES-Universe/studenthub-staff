import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Candidate Functionality on the server
 */
@Injectable()
export class CandidateIdCardService {

  private _candidateEndpoint: string = "/candidate-id-cards";

  constructor(private _authhttp: AuthHttpService) { }
  
  /**
   * Renew ID cards 
   * @returns {Observable<any>}
   */
  renew(candidates: any): Observable<any> {
    let url = this._candidateEndpoint + '/renew';
    let params = {
      "candidates": candidates
    };
    return this._authhttp.post(url, params);
  }

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
  listExpiredIds(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/list-expired?candidate_name=' + candidate_name + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * Total candidates whose card not generated, to generate card
   * @returns {Observable<any>}
   */
  totalExpiredIds(): Observable<any> {
    let url = this._candidateEndpoint + '/total-expired';
    return this._authhttp.get(url);
  }

  /**
   * List of all candidates whose card not generated, to generate card
   * @returns {Observable<any>}
   */
  listCandidates(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/list-candidates?candidate_name=' + candidate_name + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates whose card already generated, to download zip 
   * @returns {Observable<any>}
   */
  listCandidateIds(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/list-candidate-ids?candidate_name=' + candidate_name + '&page=' + page;
    return this._authhttp.getRaw(url);
  }
}
