import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';
// models
import { Request } from 'src/app/models/request';


@Injectable({
  providedIn: 'root'
})
export class CompanyRequestService {

  private companyRequestEndpoint = '/requests';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List all requests
   * @returns {Observable<any>}
   */
  list(companyID: number): Observable<any> {
    const url = this.companyRequestEndpoint + '?company_id=' + companyID +
      '&expand=staffs,company,staff,requestCreatedBy,requestUpdatedBy,contact,requestActivities,requestActivities.staff';
    return this._authhttp.get(url);
  }

  /**
   * List all requests with page
   * @returns {Observable<any>}
   */
  listWithPagination(page: number, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '?page=' + page + urlParams +
      '&expand=staffs,staff,requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';
    return this._authhttp.getRaw(url);
  }

  /**
   * requests started/active but not by login user
   */
  listActiveRequests(filterParams = '') : Observable<any> {
    let url = this.companyRequestEndpoint + '/active?' + filterParams + '&expand=staffs,staff,lastActivity,lastActivity.createdBy,company';
    return this._authhttp.get(url);
  }

 /**
   * requests started/active but not by login user
   */
  listActiveWithPages(page: number, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '/active?page=' + page + urlParams +
      '&expand=staffs,staff,lastActivity,lastActivity.createdBy,company';
    return this._authhttp.getRaw(url);
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
      location: model.request_location,
      additional_info: model.request_additional_info,
      compensation: model.request_compensation,
      job_description: model.request_job_description
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
      location: model.request_location,
      additional_info: model.request_additional_info,
      compensation: model.request_compensation,
      job_description: model.request_job_description
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
   * view request
   * @param id
   */
  view(id): Observable<any> {
    const url = this.companyRequestEndpoint + '/' + id +
      '?expand=staffs,staff,requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';
    return this._authhttp.get(url);
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
