import { Contact } from "./contact";
import { Country } from "./country";

export class ComapanyRequest {
    company_request_uuid: string;
    contact_uuid: string;
    company_name: string;
    company_email: string;
    contact_position: string;
    contact_name: string;
    contact_password_hash: string;
    contact_receive_email: any;
    phone_number: string;
    status: number;
    created_at: string;
    updated_at: string;
    contact: Contact;
    country_id: number;
    currency_code: string;
    requesting_for: string;
    country: Country;
} 