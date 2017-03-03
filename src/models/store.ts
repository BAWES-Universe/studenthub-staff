import { Candidate } from './candidate';

export class Store{
    store_id: number;
    company_id: number;
    store_name: string;
    store_status: number;
    candidates: Candidate[];
}
