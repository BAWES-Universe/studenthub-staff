import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';
// model
import { Candidate } from 'src/app/models/candidate';
import { Country } from 'src/app/models/country';
import { Note } from 'src/app/models/note';


@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  public candidates = [];

  public algoliaConfig;

  private _candidateEndpoint = '/candidates';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all candidates whose civil id got expired
   * @returns {Observable<any>}
   */
  listAssignedExpiredIds(candidate_name: string, page: number): Observable<any> {
    let url = this._candidateEndpoint + '/expired-civil-id?candidate_name=' + candidate_name + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * toggle committed
   * @param model
   */
  toggleCommitted(model: Note): Observable<any>{
    const url = `${this._candidateEndpoint}/toggle-committed`;
    return this._authhttp.patch(url, {
      candidate_id: model.candidate_id,
      note: model.note_text,
      type: model.note_type
    });
  }

  /**
   * candidate detail
   * @returns {Observable<any>}
   */
  detail(id: number): Observable<any> {
    const url = this._candidateEndpoint + '/detail/' + id + '?expand=candidateIdCard,store,company,candidateSkills,candidateTags,candidateTags.createdBy,candidateExperiences,bank,nationality,area,country,university,invited,invitationAccepted,invitationRejected,suggestionAccepted,suggestionRejected,suggested';
    return this._authhttp.get(url);
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
    return this._authhttp.getRaw(url + '?expand=store,company,candidateSkills,candidateTags,candidateExperiences');
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  listFilter(search: string, page: number): Observable<any> {
    const url = this._candidateEndpoint + '/filter?page=' + page + search + '&expand=store,company,candidateSkills,candidateTags,candidateExperiences';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  export(search: string, page: number = 1, fileName= 'candidate-data.xlsx'): Observable<any> {
    const url = this._candidateEndpoint + '/export-candidate?page=' + page + search;
    return this._authhttp.excelget(url, fileName);
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  exportAssigned(search: string, page: number = 1, fileName= 'candidate-work-history.xlsx'): Observable<any> {
    const url = this._candidateEndpoint + '/export-assigned-history?page=' + page + search;
    return this._authhttp.excelget(url, fileName);
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
     + '&expand=store,company,candidateSkills,candidateTags,candidateExperiences';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates not asigned to store
   * @returns {Observable<any>}
   */
  listNotAssigned(candidate_name: string, page: number, incompleteProfile = 0, withoutBank = 0): Observable<any> {
    const url = this._candidateEndpoint + '/not-assigned?candidate_name=' + candidate_name + '&page=' + page + '&incomplete_profile=' + incompleteProfile + '&without_bank=' + withoutBank + '&expand=store,company,candidateSkills,candidateTags,candidateExperiences';
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
      //hourly_rate: model.candidate_hourly_rate,
      candidate_status: model.candidate_status,
      candidate_objective: model.candidate_objective,
      candidate_gender: model.candidate_gender,
      candidate_driving_license: model.candidate_driving_license,
      skill: model.skill,
      tags: model.tags,
      experience: model.experience,
      resume: model.candidate_resume,
      latitude: model.candidate_latitude,
      longitude: model.candidate_longitude,
      area_uuid: model.candidate_area_uuid,
      mom_kuwait: model.candidate_mom_kuwaiti,
      preferred_time: model.candidate_preferred_time
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
      //hourly_rate: model.candidate_hourly_rate,
      candidate_status: model.candidate_status,
      candidate_objective: model.candidate_objective,
      candidate_gender: model.candidate_gender,
      candidate_driving_license: model.candidate_driving_license,
      skill: model.skill,
      tags: model.tags,
      experience: model.experience,
      resume: model.candidate_resume,
      latitude: model.candidate_latitude,
      longitude: model.candidate_longitude,
      area_uuid: model.candidate_area_uuid,
      mom_kuwait: model.candidate_mom_kuwaiti,
      preferred_time: model.candidate_preferred_time
    };

    return this._authhttp.patch(url, params);
  }

  addTag(params) {
    const url = `${this._candidateEndpoint}/add-tag/${params.candidate_id}`;
    return this._authhttp.post(url, params);
  }

  updateTags(model, tags): Observable<any> {
    const url = `${this._candidateEndpoint}/update-tags/${model.candidate_id}`;
    const params = {
      tags: tags
    };
    return this._authhttp.patch(url, params);
  }

  /**
   * merge 2 account
   * @param source
   * @param destination
   */
  merge(source, destination): Observable<any> {
    const url = `${this._candidateEndpoint}/merge`;
    return this._authhttp.patch(url, {
      source: source,
      destination: destination
    });
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
   * Removes Candidate from Assigned store
   * @param candidate
   * @param feedback
   * @param store_id
   */
  markDuplicate(candidate: Candidate): Observable<any> {
    const url = `${this._candidateEndpoint}/mark-duplicate/${candidate.candidate_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Removes Candidate from Assigned store
   * @param candidate
   * @param feedback
   * @param store_id
   */
  removeFromAssignedStore(candidate: Candidate, feedback: string, store_id:number = null): Observable<any> {
    const url = `${this._candidateEndpoint}/unassign/${candidate.candidate_id}?store_id=${store_id}&feedback=${feedback}`;
    return this._authhttp.delete(url);
  }

  /**
   * Assign candidate to store
   * @param {Candidate} candidate
   * @param {number} store_id
   * @returns {Observable<any>}
   */
  assignCandidateToStore(
      candidate: Candidate,
      store_id: number,
      rate: number,
      start_date: string = null
  ): Observable<any> {
    const params = {
      store_id: store_id,
      hourly_rate: rate,
      start_date: start_date
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
   * return warnings issued for not joining interview
   */
  warnCandidate(candidate_id, params: any): Observable<any> {
    const url = this._candidateEndpoint + '/warn-candidate/' + candidate_id;
    return this._authhttp.post(url, {
      title: params.title, 
      message: params.message
    });
  }

  updateWarning(params: any): Observable<any> {
    const url = this._candidateEndpoint + '/update-warning/' + params.warning_id;
    return this._authhttp.patch(url, {
      title: params.title, 
      message: params.message
    });
  }

  /**
   * return warnings issued for not joining interview
   */
  candidateWarnings(candidate_id, page): Observable<any> {
    const url = this._candidateEndpoint + '/candidate-warnings/' + candidate_id + '?expand=createdBy' + '&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * return work history
   * @param candidate
   */
  workHistory(candidate_id): Observable<any> {
    const url = this._candidateEndpoint + '/work-history/' + candidate_id + '?expand=store,company';
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
    const url = this._candidateEndpoint + '/total-to-review';
    return this._authhttp.get(url);
  }

  /**
   * approve candidate
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  approve(model: Candidate): Observable<any>{
    const url = `${this._candidateEndpoint}/approve/${model.candidate_id}`;
    return this._authhttp.patch(url, {});
  }

  /**
   * unapprove candidate
   * @param {Candidate} model
   * @returns {Observable<any>}
   */
  unapprove(model: Candidate): Observable<any>{
    const url = `${this._candidateEndpoint}/unapprove/${model.candidate_id}`;
    return this._authhttp.patch(url, {});
  }

  /**
   * update candidate hourly rate
   * @param model
   * @param rate
   */
  updateHour(model: Candidate, rate: number): Observable<any>{
    const url = `${this._candidateEndpoint}/update-hour-rate/${model.candidate_id}`;
    return this._authhttp.patch(url, {
      hourly_rate: rate
    });
  }

  /**
   * update candidate hourly rate
   * @param model
   * @param rate
   */
  expired(model: Candidate): Observable<any>{
    const url = `${this._candidateEndpoint}/expire-card/${model.candidate_id}`;
    return this._authhttp.patch(url, {});
  }

  /**
   * update candidate hourly rate
   * @param model
   * @param exportWithNumber
   */
  exportCV(model: Candidate, exportWithNumber = 1): Observable<any>{
    const url = `${this._candidateEndpoint}/candidate-resume-pdf/${model.candidate_id}?with_number=${exportWithNumber}`;
    return this._authhttp.pdfget(url, model.candidate_name + '-cv');
  }

  /**
   * Assigned Idle Candidates
   * @param candidateName
   * @param page
   */
  assignedIdleCandidate(candidateName: string, page: number): Observable<any>{
    const url = this._candidateEndpoint + '/assigned-idle-candidate?candidate_name=' + candidateName + '&page=' + page + '&expand=store,company,workHistory';
    return this._authhttp.getRaw(url);
  }

  /**
   * download candidate appreciation certificate
   * @param candidateID
   * @param workHistoryID
   */
  downloadCertificate(candidateID: number, workHistoryID: number): Observable<any> {
    let url = `${this._candidateEndpoint}/appreciation-certificate/${candidateID}/${workHistoryID}`;
    return this._authhttp.pdfget(url, 'appreciation-certification-' + candidateID + '.pdf');
  }

  /**
   * update candidate email
   * @param email
   * @param id
   */
  updateCandidateEmail(email, id): Observable<any> {
    const url = `${this._candidateEndpoint}/update-email/${id}`;
    return this._authhttp.patch(url, {
      email
    });
  }

  updateCivilExpiry(civil, id): Observable<any> {
    const url = `${this._candidateEndpoint}/update-civil-expiry/${id}`;
    return this._authhttp.patch(url, {
      date: civil
    });
  }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  listAssignHistoryList(search: string, page: number): Observable<any> {
    const url = this._candidateEndpoint + '/assigned-history-list?page=' + page + search + '&expand=store,company,candidate';
    return this._authhttp.getRaw(url);
  }
}
