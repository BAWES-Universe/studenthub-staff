import { Candidate } from './candidate';
import { Bank } from './bank';
import { Store } from './store';
import { Company } from './company';

export class TransferCandidate {
    tc_id: number;
    transfer_id: number;
    candidate_id: number;
    store_id: number;
    store_name: string;
    company_id: number;
    bank_id: number;
    transfer_confirmation_id: any;
    transfer_file_id: any;
    transfer_benef_name: any;
    transfer_benef_iban: any;
    company_name: string;
    company_email: string;
    candidate_hourly_rate: number;
    company_hourly_rate: number;
    hours: number;
    bonus: number;
    base: number;
    candidate_bonus: number;
    transfer_cost: number;
    paid: number;
    total: number;
    status: any;
    tc_created_at: string;
    tc_updated_at: string;
    
    candidate_total: number;
    company_total: number;

    total_paid: number;//company_total - dynamically calculated
    total_amount: number;//candidate_total - dynamically calculated
    currency_code: string;
    
    profit: number;
    candidate: Candidate;
    bank: Bank;
    store: Store;
    company: Company;
}
