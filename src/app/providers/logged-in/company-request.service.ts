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

  constructor(private authhttp: AuthHttpService) { }

  /**
   * List all requests
   * @returns {Observable<any>}
   */
  list(companyID: number): Observable<any> {
    const url = this.companyRequestEndpoint + '?company_id=' + companyID +
      '&expand=company,staff,requestCreatedBy,requestUpdatedBy,contact,requestActivities,requestActivities.staff';
    return this.authhttp.get(url);
  }

  /**
   * List all requests with page
   * @returns {Observable<any>}
   */
  listWithPagination(page: number, urlParams: string = ''): Observable<any> {
    const url = this.companyRequestEndpoint + '?page=' + page + urlParams +
      '&expand=staff,requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';
    return this.authhttp.getRaw(url);
  }

  /**
   * load pending requests
   */
  listPendingRequests() : Observable<any> {
    const url = this.companyRequestEndpoint + '/pending?expand=staff,lastActivity,lastActivity.createdBy,company';
    return this.authhttp.get(url);
  }

  /**
   * requests managed by current user
   */
  listMyRequests() : Observable<any> {
    const url = this.companyRequestEndpoint + '/my?expand=staff,lastActivity,lastActivity.createdBy,company';
    return this.authhttp.get(url);
  }

  /**
   * requests started/active but not by login user
   */
  listActiveRequests() : Observable<any> {
    const url = this.companyRequestEndpoint + '/active?expand=staff,lastActivity,lastActivity.createdBy,company';
    return this.authhttp.get(url);
  }

  /**
   * create request
   * @param model
   */
  create(model: Request): Observable<any> {
    return this.authhttp.post(this.companyRequestEndpoint, {
      company_id: model.company_id,
      contact_uuid: model.contact_uuid,
      position_type: model.request_position_type,
      position_title: model.request_position_title,
      number_of_employees: model.request_number_of_employees,
      additional_info: model.request_additional_info
    });
  }

  /**
   * start request
   * @param model
   */
  start(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/start/${model.request_uuid}`;
    return this.authhttp.patch(url, {});
  }

  /**
   * cancel request
   * @param model
   */
  cancel(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/cancel/${model.request_uuid}`;
    return this.authhttp.patch(url, {
      feedback: model.request_feedback
    });
  }

  /**
   * deliver request
   * @param model
   */
  deliver(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/deliver/${model.request_uuid}`;
    return this.authhttp.patch(url, {
      feedback: model.request_feedback
    });
  }

  /**
   * deliver request
   * @param model
   */
  pickup(model: Request): Observable<any> {
    const url = `${this.companyRequestEndpoint}/pick-up/${model.request_uuid}`;
    return this.authhttp.patch(url, {});
  }

  /**
   * update request
   * @param model
   */
  update(model: Request): Observable<any> {
    return this.authhttp.patch(`${this.companyRequestEndpoint}/${model.request_uuid}`, {
      company_id: model.company_id,
      contact_uuid: model.contact_uuid,
      position_type: model.request_position_type,
      position_title: model.request_position_title,
      number_of_employees: model.request_number_of_employees,
      additional_info: model.request_additional_info
    });
  }

  /**
   * delete request
   * @param model
   */
  delete(model: Request): Observable<any> {
    return this.authhttp.delete(`${this.companyRequestEndpoint}/${model.request_uuid}`);
  }

  /**
   * view request
   * @param id
   */
  view(id): Observable<any> {
    const url = this.companyRequestEndpoint + '/' + id +
      '?expand=requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';
    return this.authhttp.get(url);
  }

  /**
   * add activity
   * @param params
   */
  addActivity(params) : Observable<any> {
    let url = this.companyRequestEndpoint + '/add-activity';
    return this.authhttp.post(url, params);
  }
}
