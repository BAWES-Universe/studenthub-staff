import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  public setOneSignal$ = new Subject();
  public profileUpdated$ = new Subject();
  public error404$ = new Subject();
  public error500$ = new Subject();
  public errorStorage$ = new Subject();
  
  public userLogined$ = new Subject();

  public pageSelected$ = new Subject();
  public internetOffline$ = new Subject();
  public internetOnline$ = new Subject();
  public userLoggedOut$ = new Subject();
  public accountAssignmentRemoved$ = new Subject();
  public reloadCandidateHistory$ = new Subject();
  public reloadCandiate$ = new Subject();
  public reloadCompanyList$ = new Subject();
  public reloadBrand$ = new Subject();
  public reloadStats$ = new Subject();
  public storyStatusUpdated$ = new Subject();
  
  public companyRequestCancelled$ = new Subject();

  public companyRequestDelivered$ = new Subject();

  public clearCandidateSelection$ = new Subject();

  public filterCollapse$ = new Subject();

  public expiredIdCard$ = new Subject();

  public reviewRequired$ = new Subject();
  public companyRequestUpdate$ = new Subject();

  public requestCountUpdated$ = new Subject();
  
  public reloadFollowupList$ = new Subject();

  public noteUpdated$ = new Subject();
  
  public invitationUpdated$ = new Subject();

  public statistics$ = new Subject();

  public transferDeleted$ = new Subject();
}
