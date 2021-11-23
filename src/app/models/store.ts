import { Candidate } from './candidate';
import { Company } from './company';
import { Brand } from './brand';
import { Mall } from './mall';
import { Contact } from "./contact";


export class Store {
    store_id: number;
    company_id: number;
    store_manager_uuid: string;
    brand_uuid: string;
    mall_uuid: string;
    store_name: string;
    store_location: string;
    store_status: number;
    store_total_candidates: any;
    candidatesCount: any;
    storeManager: Contact;
    candidates: Candidate[];
    company: Company;
    brand: Brand;
    mall: Mall;
}
