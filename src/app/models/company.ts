import { Store } from './store';

export class Company{
    company_id: number;
    parent_company_id: number;
    company_name: string;
    company_email: string;
    company_status: number;
    total_candidates: number;
    subcompanies: Company[];
    subCompanies: Company[];
    stores: Store[];
}
