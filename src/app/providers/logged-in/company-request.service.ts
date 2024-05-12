import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';
// models
import { Request, RequestSkill } from 'src/app/models/request';


@Injectable({
  providedIn: 'root'
})
export class CompanyRequestService {

  private companyRequestEndpoint = '/requests';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List all requests with page
   * @returns {Observable<any>}
   */
  listWithPagination(page: number, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '?page=' + page + urlParams;
    return this._authhttp.getRaw(url);
  }

  /**
   * requests started/active but not by login user
   */
  listActiveRequests(filterParams = '') : Observable<any> {
    let url = this.companyRequestEndpoint + '/active?' + filterParams + '&expand=storyOwners,staffs,staff,company';
    return this._authhttp.get(url);
  }

 /**
   * requests started/active but not by login user
   */
  listActiveWithPages(page: number, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '/active?page=' + page + urlParams +
      '&expand=storyOwners,staffs,staff,company';
    return this._authhttp.getRaw(url);
  }

  /**
   * list candidate applications
   * @param request_uuid 
   * @param page 
   * @returns 
   */
  listApplications(request_uuid: string, page: number) : Observable<any> {
    let url = this.companyRequestEndpoint + '/applications/'+ request_uuid +'?expand=candidate,requestInterview&page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * list interview requests 
   * @param page 
   * @returns 
   */
  listInterviewRequests(page: number, urlParams: string = "") : Observable<any> {
    let url = this.companyRequestEndpoint + '/interview-requests?expand=candidate&page=' + page + urlParams;
    return this._authhttp.getRaw(url);
  }
  
  /**
   * view request
   * @param id
   */
  view(id, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '/' + id + urlParams;
    return this._authhttp.get(url);
  }

  /**
   * accept interview request 
   * @param request_interview_uuid 
   * @returns 
   */
  acceptInterviewRequest(request_interview_uuid: string, params = {}): Observable<any> {
    const url = this.companyRequestEndpoint + '/accept-interview-request/' + request_interview_uuid;
    return this._authhttp.patch(url, params);
  }
  
  /**
   * @param request_interview_uuid 
   * @returns 
   */
  rejectInterviewRequest(request_interview_uuid: string): Observable<any> {
    const url = this.companyRequestEndpoint + '/reject-interview-request/' + request_interview_uuid;
    return this._authhttp.patch(url, {});
  } 

  /**
   * requests started/active but not by login user
   */
  listAllRequestsThatHaveSuggestedCadidates(page: number, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '/pending-request?page=' + page + urlParams;
    return this._authhttp.getRaw(url);
  }
  
  /**
   * return request checklist
   * @returns
   */
  listChecklist(): Observable<any> {
    const url = this.companyRequestEndpoint + '/list-checklist';
    return this._authhttp.get(url);
  }

  /**
   * create request
   * @param model
   */
  create(model: Request): Observable<any> {
    return this._authhttp.post(this.companyRequestEndpoint, {
      company_id: model.company_id,
      contact_uuid: model.contact_uuid,
      position_type: model.request_position_type,
      position_title: model.request_position_title,
      number_of_employees: model.request_number_of_employees,
      no_of_employees_per_story: model.no_of_employees_per_story,
      location: model.request_location,
      additional_info: model.request_additional_info,
      compensation: model.request_compensation,
      job_description: model.request_job_description,
      requestSkills: model.requestSkills,
      nationality_id: model.nationality_id, 
      gender: model.gender
    });
  }

  /**
   * cancel request
   * @param model
   */
  cancel(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/cancel/${model.request_uuid}`;
    return this._authhttp.patch(url, {
      feedback: model.request_feedback
    });
  }

  /**
   * update request status
   * @param model
   */
  statusUpdate(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/update-status/${model.request_uuid}`;
    return this._authhttp.patch(url, {
      status: model.request_status
    });
  }

  /**
   * cancel request
   * @param param
   */
  updateInterval(param): Observable<any> {
    const url = `${this.companyRequestEndpoint}/update-interval/${param.request_uuid}`;
    return this._authhttp.patch(url, {
      hours: param.num_hours_followup_interval,
      reason: param.reason
    });
  }

  /**
   * deliver request
   * @param model
   */
  deliver(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/deliver/${model.request_uuid}`;
    return this._authhttp.patch(url, {
      feedback: model.request_feedback
    });
  }

  /**
   * update request
   * @param model
   */
  update(model: Request): Observable<any> {
    return this._authhttp.patch(`${this.companyRequestEndpoint}/${model.request_uuid}`, {
      company_id: model.company_id,
      contact_uuid: model.contact_uuid,
      position_type: model.request_position_type,
      position_title: model.request_position_title,
      number_of_employees: model.request_number_of_employees,
      no_of_employees_per_story: model.no_of_employees_per_story,
      location: model.request_location,
      additional_info: model.request_additional_info,
      compensation: model.request_compensation,
      job_description: model.request_job_description,
      requestSkills: model.requestSkills,
      nationality_id: model.nationality_id, 
      gender: model.gender
    });
  }

  /**
   * delete request
   * @param model
   */
  delete(model: Request): Observable<any> {
    return this._authhttp.delete(`${this.companyRequestEndpoint}/${model.request_uuid}`);
  }

  /**
   * add activity
   * @param params
   */
  addActivity(params) : Observable<any> {
    let url = this.companyRequestEndpoint + '/add-activity';
    return this._authhttp.post(url, params);
  }

  /**
   * check if request updated
   * @param request_uuid
   */
  isRequestUpdated(request_uuid) : Observable<any> {
    let url = this.companyRequestEndpoint + '/is-request-updated/' + request_uuid;
    return this._authhttp.get(url);
  }

  /**
   * assign staff to request
   * @param request_uuid
   * @param staff_id
   * @returns
   */
   assign(request_uuid, staff_id): Observable<any>{
    return this._authhttp.patch(`${this.companyRequestEndpoint}/assign/${request_uuid}`, {
      staff_id: staff_id
    });
  }
}
