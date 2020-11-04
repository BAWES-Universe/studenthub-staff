import { Store } from './store';
import { CompanyContact } from './company-contact';
import { Request } from './request';
import {Transfer} from "./transfer";
import {Mall} from "./mall";

export class Company {
    company_id: number;
    parent_company_id: number;
    company_name: string;
    company_common_name_en: string;
    company_common_name_ar: string;
    company_description_en: string;
    company_description_ar: string;
    company_website: string;
    company_email: string;
    company_password_hash: string;
    company_logo: string;
    company_status: number;
    total_candidates: number;
    company_hourly_rate: number;
    company_bonus_commission: number;
    company_followup: any;
    company_last_followup_datetime: any;
    currency_pref: number;
    subcompanies: Company[];
    subCompanies: Company[];
    stores: Store[];
    files: any[];
    brands: any[];
    notes: any[];
    malls: Mall[];
    companyContacts: CompanyContact[];
    requests: Request[];
    parentTransfers: Transfer[];
}
