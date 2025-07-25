import { Injectable } from '@angular/core';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [];

  public setPermissions(perms: Permission[]): void {
    this.permissions = perms;
  }

  public hasPermission(action: string, section?: string, context?: any): boolean {
    return this.permissions.some(p => {
      let _check = true;
      if(p.companyIds.length > 0){
        _check = Number(context?.companyId) && p.companyIds.includes(Number(context?.companyId));
      }
      return p.action === action &&
      (!section || p.section === section) &&
      _check
    });
  }

  public shouldShowFinancialsTab(companyId: number): boolean {
    return this.hasPermission('candidate-financials', 'Candidate', { companyId });
  }

  public shouldShowActivity(activityNote: any, companyId: number): boolean {
    if (this.hasPermission('company-activity', 'Company', { companyId }) && activityNote?.note_text?.toLowerCase()?.includes('transfer')) {
      return false;
    }
    return true;
  }

  public canLoginAsOther(companyId: number): boolean {
    return this.hasPermission('company-contact-login', 'Company', { companyId });
  }
}
