import { Store } from './store';

export class Company{
    company_id: number;
    parent_company_id: number;
    company_name: string;
    company_email: string;
    company_status: number;
    total_candidates: number;
    company_hourly_rate: number;
    company_bonus_commission: number;
    currency_pref: number;
    subcompanies: Company[];
    subCompanies: Company[];
    stores: Store[];
    files: any[];
}
