import { Candidate } from './candidate';
import { Company } from './company';
import {Brand} from "./brand";

export class Store {
    store_id: number;
    company_id: number;
    brand_uuid: string;
    store_name: string;
    store_status: number;
    store_total_candidates: any;
    candidates: Candidate[];
    company: Company;
    brand: Brand;
}
