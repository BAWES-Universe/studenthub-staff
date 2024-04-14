import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  public statistics: {
    id_need_generated: any;
    totalExpiredCards: any;
    assignedExpiredCivilID: any;
    activeRequests: any;
    requireFollowup: any;
    last40daysNoRequest: any;
    missingBankInfo: any;
    incompleteAssignedToWork: any;
    profileApprovalRequire: any;
    assignedIdleCandidates: any;
    companyMoreThen40DaysWithoutPayment: any;
    transfersWithNoProfitInProgress: any;
    transfersWithSameRateInProgress: any;
    companyUnderReview: any;
    totalUnverifiedEmails: any;
  };

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
  public changePassword$ = new Subject();

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
 
  public transferDeleted$ = new Subject();

  public storeDeleted$ = new Subject();
  public storeUpdated$ = new Subject();

  public startStory$ = new Subject();
  public stopStory$ = new Subject();
  public deliverStory$ = new Subject();
  public changeStoryStatus$ = new Subject();
  public changeRequestStatus$ = new Subject();
  public createStory$ = new Subject();

  public warningUpdated$ = new Subject();

  public campaignStarted$ = new Subject();
  public campaignStopped$ = new Subject();
  public campaignStatus$ = new Subject();
  public campaignStatusList$ = new Subject();

  public googleLoginFinished$ = new Subject();
}
