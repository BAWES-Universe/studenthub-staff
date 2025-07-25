import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Permission } from '../models/permission';
import { UserPermission } from '../models/user-permission';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [];
  private _urlPermission = '/permission-section/user-permission/staff';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public setPermissions(perms: Permission[]): void {
    this.permissions = perms;
  }

  public hasPermission(action: string, section?: string, context?: any): boolean {
    return this.permissions.some(p =>
      p.action === action &&
      (!section || p.section === section) &&
      (!context?.companyId || p.companyId === context.companyId)
    );
  }

  public shouldShowFinancialsTab(companyId: number): boolean {
    return this.hasPermission('candidate.financials', 'Candidate', { companyId });
  }

  public shouldShowActivity(activity: any, companyId: number): boolean {
    if (companyId === 123 && activity.name?.includes('transfer')) {
      return false;
    }
    return this.hasPermission('company.activity', 'Company', { companyId });
  }

  public canLoginAsOther(companyId: number): boolean {
    return this.hasPermission('company.contact-login', 'Company', { companyId });
  }

  public loadPermissions(): Observable<Permission[]> {
    const staffId = this.authService.staff_id;
    if (!staffId) {
      return of([]);
    }

    const url = `${environment.apiEndpoint}${this._urlPermission}/${staffId}`;
    return this.http.get<UserPermission[]>(url).pipe(
      map(userPermissions => {
        const permissions: Permission[] = userPermissions.map(up => ({
          id: up.permission_sub_section_uuid,
          action: up.sub_section_slug,
          section: up.section_name,
          companyId: up.is_company_specific_permission && up.companies && up.companies.length > 0 ? up.companies[0] : undefined
        }));
        this.setPermissions(permissions);
        return permissions;
      }),
      catchError(error => {
        console.error('Error loading permissions:', error);
        return of([]);
      })
    );
  }
}
