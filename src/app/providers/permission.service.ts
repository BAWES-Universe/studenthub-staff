import { Injectable } from '@angular/core';
import { Permission } from '../models/permission';
import { UserPermission } from '../models/user-permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [];
  private companySpecificPermissions: String[] = [
    "candidate-financials",
    "company-contact-login",
    "company-activity",
    "company-stats",
    "company-contracts",
    "company-transfers",
    "company-notes",
  ];

  private companySpecificPermissionsSection: String[] = [
    "Candidate",
    "Company"
  ];

  public setPermissions(userPermissions: UserPermission[]): void {
    const permissions: Permission[] = userPermissions.map(up => ({
        id: up.permission_sub_section_uuid,
        sub_section_name: up.sub_section_slug,
        section_name: up.section_name,
        companyIds: up.is_company_specific_permission && up.companies && up.companies.length > 0 ? up.companies : [],
        is_company_specific_permission: up.is_company_specific_permission ? 1 : 0
    }));
    this.permissions = permissions;
  }

  public hasPermission(action: string, section?: string, context?: any): boolean {
    return this.permissions.some(p => {
      if(this.companySpecificPermissions.includes(action) && this.companySpecificPermissionsSection.includes(section)){
        if(p.section_name === section){
          const _check = Number(context?.companyId) && p.companyIds.includes(Number(context?.companyId));
          if(_check) return p.section_name === section && p.sub_section_name === action;
          else return true;
        } return true;
      }
      return p.sub_section_name === action && (!section || p.section_name === section);
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
