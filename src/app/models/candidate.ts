import { Store } from './store';
import { Company } from './company';
import { Bank } from './bank';
import { University } from './university';
import { Country } from './country';

export class Candidate {
    employee_id:number;
    candidate_id: string;
    candidate_uid: string;
    store_id: number;
    bank_id: number;
    university_id: number;
    country_id: number;
    bank_account_name: string;
    candidate_iban: string;
    candidate_name: string;
    candidate_name_ar: string;
    candidate_personal_photo: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_address_line1
    candidate_birth_date: string;
    candidate_civil_id: string;
    candidate_civil_expiry_date: string;
    candidate_civil_photo_front: string;
    candidate_civil_photo_back: string;
    candidate_hourly_rate: string;
    candidate_status: string;
    approved: number;
    age: string;
    candidate_personal_photo_thumb: string;

    store: Store;
    company: Company;
    university: University;
    country: Country;
    bank: Bank;
}
