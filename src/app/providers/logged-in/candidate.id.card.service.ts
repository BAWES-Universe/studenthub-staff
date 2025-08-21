import { Injectable } from '@angular/core';
import {AuthHttpService} from "./authhttp.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CandidateIdCardService {

  public candidates = [];

  private _candidateEndpoint: string = "/candidate-id-cards";

  constructor(private _authhttp: AuthHttpService) {
  }

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

  requestIds(candidates: any): Observable<any> {
    let url = this._candidateEndpoint + '/candidate-id-request';
    let params = {
      "candidates": candidates
    };
    return this._authhttp.post(url, params);
  }

  /**
   * generate candidate id zip
   * @returns {Observable<any>}
   */
  generate(candidates: any): Observable<any> {
    const url = this._candidateEndpoint + '/generate';
    const filename = `id-cards-${Date.now()}.zip`;
    return this._authhttp.generateCards(url, { candidates }, filename);
  }

  /**
   * List of all candidates whose card not generated, to generate card
   * @returns {Observable<any>}
   */
  listExpiredIds(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/list-expired?candidate_name=' + candidate_name + '&page=' + page + '&expand=candidateIdCard';
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
