import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Permission } from '../models/permission';
import { UserPermission } from '../models/user-permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private _urlPermission = '/permission-section'; // Adjust the endpoint as per your API
  private _urlUserPermission = '/permission-section/user-permission/staff'; // Adjust the endpoint as per your API
  
  // Store permission lists as class properties
  private _permissionList: Permission[] = [];
  private _flattenedPermissions: { [key: string]: boolean } = {};

  constructor(private _http: HttpClient) { }

  private updateFlattenedPermissions(userPermissionList: UserPermission[]): void {
    this._flattenedPermissions = {};
    userPermissionList.forEach(up => {
      const key = `${up.section_name}_${up.sub_section_slug}`;
      this._flattenedPermissions[key] = true;
    });
  }

  public hasPermission(action: string, section?: string, context?: any): boolean {
    // For company-specific permissions, check if the user has the permission for the specific company
    const permission = this._permissionList.find(p => p.section_name === section);
    const permissionKey = `${section}_${action}`;
    
    if (permission && permission.is_company_specific_permission === 1) {
      // If it's a company-specific permission, check company
      const _check = permission.companies?.includes(Number(context.companyId)) ?? false;
      
      if (_check) return this._flattenedPermissions[permissionKey] ?? false;
      else return true;
    }
    
    return this._flattenedPermissions[permissionKey] ?? false;
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

  /**
   * Loads both permission lists and stores them in the service
   * @param staffId The ID of the staff member
   * @param accessToken The authentication token
   * @returns Observable with both permission lists
   */
  public loadPermissions(staffId: number, accessToken: string): Observable<{
    permissions: Permission[];
    userPermissions: UserPermission[];
  }> {
    const permissionList$ = this._http.get<Permission[]>(
      `${environment.apiEndpoint}${this._urlPermission}`,
      this._getRequestOptions(accessToken)
    ).pipe(catchError(this._handleError<Permission[]>('getPermissionList', [])));

    const userPermissionList$ = this._http.get<UserPermission[]>(
      `${environment.apiEndpoint}${this._urlUserPermission}/${staffId}`,
      this._getRequestOptions(accessToken)
    ).pipe(catchError(this._handleError<UserPermission[]>('getUserPermissionList', [])));

    return forkJoin({
      permissions: permissionList$,
      userPermissions: userPermissionList$
    }).pipe(
      tap(({ permissions, userPermissions }) => {
        this._permissionList = permissions;
        this.updateFlattenedPermissions(userPermissions);
      })
    );
  }

  private _getRequestOptions(accessToken: string): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      })
    };
  }

  private _handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
