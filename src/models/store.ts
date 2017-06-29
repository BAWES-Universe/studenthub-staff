import { Candidate } from './candidate';
import { Company } from './company';

export class Store {
    store_id: number;
    company_id: number;
    store_name: string;
    store_status: number;
    candidates: Candidate[];    
    company: Company;
}
