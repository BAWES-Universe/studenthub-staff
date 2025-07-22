// Centralized restriction logic and constants for company/staff access control
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RestrictionService {
  readonly RESTRICTED_COMPANY_ID = 1;
  readonly ALLOWED_STAFF_IDS: number[] = [5];

  /**
   * Returns true if the current company and staff are restricted.
   * @param company_id Company ID to check
   * @param staff_id Staff ID to check
   */
  isCompanyAndStaffRestricted(company_id: number, staff_id: number): boolean {
    return this.RESTRICTED_COMPANY_ID &&
      company_id == this.RESTRICTED_COMPANY_ID &&
      staff_id &&
      (this.ALLOWED_STAFF_IDS.indexOf(staff_id) === -1);
  }
}
