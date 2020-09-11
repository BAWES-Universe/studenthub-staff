import { Candidate } from './candidate';
import { Store } from './store';

export class Mall {
    mall_uuid: string;
    mall_name_en: string;
    mall_name_ar: string;
    mall_created_datetime: string;
    mall_updated_datetime: string;
    candidate_count: number;
    candidates: Candidate[];
    stores: Store[];
}
