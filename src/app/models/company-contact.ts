export class CompanyContact {
    contact_uuid: string;
    company_id: number;
    contact_name: string;
    contact_position: string;
    contact_note: string;
    contact_created_datetime: string;
    contact_updated_datetime: string;
    companyContactEmails: CompanyContactEmail[];
    companyContactPhones: CompanyContactPhone[];
}

export class CompanyContactEmail {
    email_uuid: string;
    contact_uuid: string;
    email_address : string;
    email_created_datetime : string;
    email_updated_datetime: string;
} 

export class CompanyContactPhone {
    phone_uuid: string;
    contact_uuid: string;
    phone_number : string;
    phone_created_datetime : string;
    phone_updated_datetime: string;
} 
 
 