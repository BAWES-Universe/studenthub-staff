import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { Request } from 'src/app/models/request';


@Injectable({
  providedIn: 'root'
})
export class CompanyRequestService {

  private companyRequestEndpoint = '/requests';

  constructor(private authhttp: AuthHttpService) { }

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
}
