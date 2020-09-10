import { Candidate } from './candidate';
import { Store } from './store';

export class Brand {
    brand_uuid: string;
    company_id: number;
    brand_name_en: string;
    brand_name_ar: string;
    brand_logo: string;
    candidate_count: number;
    brand_created_datetime: string;
    brand_updated_datetime: string;
    candidates: Candidate[];
    stores: Store[];
}
