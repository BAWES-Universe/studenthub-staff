import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { EmailCampaign } from 'src/app/models/email-campaign';


@Injectable({
  providedIn: 'root'
})
export class EmailCampaignService {

  private _endpoint: string = "/email-campaigns";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * load campaign detail
   * @param campaign_uuid 
   */
  view(campaign_uuid) {
    let url = this._endpoint + '/' + campaign_uuid + '?expand=emailCampaignFilters';
    return this._authhttp.get(url);
  }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    let url = this._endpoint + '?expand=emailCampaignFilters&page=' + page;
    return this._authhttp.getRaw(url);
  }

  statusList(campaignIDs = []): Observable<any>{
    let url = this._endpoint + '/status-list';
    return this._authhttp.post(url, {
      campaignIDs: campaignIDs
    });
  }

  /**
   * Create campaign
   * @param {campaign} model
   * @returns {Observable<any>}
   */
  create(model: EmailCampaign): Observable<any>{
    let postUrl = `${this._endpoint}`; 
    return this._authhttp.post(postUrl, model);
  }

  /**
   * Update campaign
   * @param {EmailCampaign} model
   * @returns {Observable<any>}
   */
  update(model: EmailCampaign): Observable<any>{
    let url = `${this._endpoint}/${model.campaign_uuid}`; 
    return this._authhttp.patch(url, model);
  }

  start(model: EmailCampaign): Observable<any>{
    let url = `${this._endpoint}/run/${model.campaign_uuid}`; 
    return this._authhttp.patch(url, model);
  }

  /**
   * Delete campaign
   * @param {EmailCampaign} model
   * @returns {Observable<any>}
   */
  delete(model: EmailCampaign): Observable<any>{
    let url = `${this._endpoint}/${model.campaign_uuid}`;
    return this._authhttp.delete(url);
  }
}
