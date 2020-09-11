import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';
// model
import { Candidate } from 'src/app/models/candidate';
import { Country } from 'src/app/models/country';


@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  public algoliaConfig;

  private _candidateEndpoint = '/candidates';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * candidate detail
   * @returns {Observable<any>}
   */
  detail(id: number): Observable<any> {
    return this._authhttp.get(this._candidateEndpoint + '/detail/' + id + '?expand=store,company,candidateSkills,candidateExperiences,bank,country,university');
  }

  /**
   * candidate salary transfer list
   * @returns {Observable<any>}
   */
  transfers(id: number): Observable<any> {
    const url = this._candidateEndpoint + '/transfers/' + id + '?expand=bank';
    return this._authhttp.get(url);
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    const url = this._candidateEndpoint;
    return this._authhttp.getRaw(url + '?expand=store,company,candidateSkills,candidateExperiences');
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  listFilter(search: string, page: number): Observable<any> {
    const url = this._candidateEndpoint + '/filter?page=' + page + search + '&expand=store,company,candidateSkills,candidateExperiences';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates asigned to store
   * @returns {Observable<any>}
   */
  listAssigned(candidate_name: string, page: number, incompleteProfile = 0, withoutBank = 0): Observable<any> {
    const url = this._candidateEndpoint + '/assigned?candidate_name=' + candidate_name + '&page=' + page + '&incomplete_profile=' + incompleteProfile  + '&without_bank=' + withoutBank + '&expand=store,company,candidateSkills,candidateExperiences';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates without bank details
   * @returns {Observable<any>}
   */
  listWithoutBank(candidate_name: string, page: number): Observable<any> {
    const url = this._candidateEndpoint + '/without-bank?candidate_name=' + candidate_name + '&page=' + page
     + '&expand=store,company,candidate,candidate.candidateSkills,candidate.candidateExperiences';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates not asigned to store
   * @returns {Observable<any>}
   */
  listNotAssigned(candidate_name: string, page: number, incompleteProfile = 0, withoutBank = 0): Observable<any> {
    const url = this._candidateEndpoint + '/not-assigned?candidate_name=' + candidate_name + '&page=' + page + '&incomplete_profile=' + incompleteProfile + '&without_bank=' + withoutBank + '&expand=store,company,candidateSkills,candidateExperiences';
    return this._authhttp.getRaw(url);
  }

  /**
   * Create
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  create(model: Candidate): Observable<any> {
    const postUrl = `${this._candidateEndpoint}`;
    const params = {
      candidate_id: model.candidate_id,
      store_id: model.store_id,
      bank_id: model.bank_id,
      university_id: model.university_id,
      country_id: model.country_id,
      bank_account_name: model.bank_account_name,
      iban: model.candidate_iban,
      name: model.candidate_name,
      name_ar: model.candidate_name_ar,
      personal_photo: model.candidate_personal_photo,
      email: model.candidate_email,
      phone: model.candidate_phone,
      birth_date: model.candidate_birth_date,
      civil_id: model.candidate_civil_id,
      expiry_date: model.candidate_civil_expiry_date,
      photo_front: model.candidate_civil_photo_front,
      photo_back: model.candidate_civil_photo_back,
      hourly_rate: model.candidate_hourly_rate,
      candidate_status: model.candidate_status,
      candidate_objective: model.candidate_objective,
      candidate_gender: model.candidate_gender,
      candidate_driving_license: model.candidate_driving_license,
      skill: model.skill,
      experience: model.experience,
      resume: model.candidate_resume
    };
    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  update(model: Candidate): Observable<any> {
    const url = `${this._candidateEndpoint}/${model.candidate_id}`;
    const params = {
      candidate_id: model.candidate_id,
      store_id: model.store_id,
      university_id: model.university_id,
      country_id: model.country_id,
      bank_id: model.bank_id,
      bank_account_name: model.bank_account_name,
      iban: model.candidate_iban,
      name: model.candidate_name,
      name_ar: model.candidate_name_ar,
      personal_photo: model.candidate_personal_photo,
      email: model.candidate_email,
      phone: model.candidate_phone,
      birth_date: model.candidate_birth_date,
      civil_id: model.candidate_civil_id,
      expiry_date: model.candidate_civil_expiry_date,
      photo_front: model.candidate_civil_photo_front,
      photo_back: model.candidate_civil_photo_back,
      hourly_rate: model.candidate_hourly_rate,
      candidate_status: model.candidate_status,
      candidate_objective: model.candidate_objective,
      candidate_gender: model.candidate_gender,
      candidate_driving_license: model.candidate_driving_license,
      skill: model.skill,
      experience: model.experience,
      resume: model.candidate_resume
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * update job search status
   * @param params
   */
  updateJobSearchStatus(params): Observable<any> {
    const url = `${this._candidateEndpoint}/job-search-status`;
    return this._authhttp.patch(url, {
      candidate_id: params.candidate_id,
      job_search_status: params.job_search_status
    });
  }

  /**
   * Reset Password
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  resetPassword(model: Candidate): Observable<any> {
    const url = `${this._candidateEndpoint}/reset-password/${model.candidate_id}`;
    return this._authhttp.patch(url, {});
  }

  /**
   * Delete candidate
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  delete(model: Candidate): Observable<any> {
    const url = `${this._candidateEndpoint}/${model.candidate_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Removes Candidate from Assigned store
   * @param {any} candidate
   * @returns {Observable<any>}
   */
  removeFromAssignedStore(candidate: Candidate): Observable<any> {
    const url = `${this._candidateEndpoint}/unassign/${candidate.candidate_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Assign candidate to store
   * @param {Candidate} candidate
   * @param {number} store_id
   * @returns {Observable<any>}
   */
  assignCandidateToStore(candidate: Candidate, store_id: number): Observable<any> {
    const params = {
      store_id
    };
    const url = `${this._candidateEndpoint}/assign/${candidate.candidate_id}`;
    return this._authhttp.patch(url, params);
  }

  /**
   * List candidates by country
   * @param country
   * @param page
   */
  listByCountry(country: Country, page: number): Observable<any> {
    const url = this._candidateEndpoint + '/search?expand=store,company&country_id=' + country.country_id + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * return work history
   * @param candidate
   */
  workHistory(candidate_id): Observable<any> {
    const url = this._candidateEndpoint + '/work-history/' + candidate_id;
    return this._authhttp.get(url);
  }

  /**
   * List of all candidate to review changes
   * @returns {Observable<any>}
   */
  listToReview(page: number): Observable<any>{
    const url = this._candidateEndpoint + '/search?expand=store,company&by=review&review=0&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * No. of all candidate to review changes
   * @returns {Observable<any>}
   */
  totalToReview(): Observable<any>{
    return this._authhttp.get(this._candidateEndpoint + '/total-to-review');
  }

  /**
   * approve candidate
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  approve(model: Candidate): Observable<any>{
    return this._authhttp.patch(`${this._candidateEndpoint}/approve/${model.candidate_id}`, {});
  }

  /**
   * unapprove candidate
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  unapprove(model: Candidate): Observable<any>{
    return this._authhttp.patch(`${this._candidateEndpoint}/unapprove/${model.candidate_id}`, {});
  }

  /**
   * update candidate hourly rate
   * @param model
   * @param rate
   */
  updateHour(model: Candidate, rate: number): Observable<any>{
    return this._authhttp.patch(`${this._candidateEndpoint}/update-hour-rate/${model.candidate_id}`, {
      hourly_rate: rate
    });
  }
  /**
   * update candidate hourly rate
   * @param model
   * @param rate
   */
  expired(model: Candidate): Observable<any>{
    return this._authhttp.patch(`${this._candidateEndpoint}/expire-card/${model.candidate_id}`, {});
  }
  /**
   * update candidate hourly rate
   * @param model
   * @param rate
   */
  exportCV(model: Candidate): Observable<any>{
    return this._authhttp.pdfget(`${this._candidateEndpoint}/candidate-resume-pdf/${model.candidate_id}`, model.candidate_name + '-cv');
  }
}
