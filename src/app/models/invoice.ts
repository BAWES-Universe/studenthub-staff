import { Company } from './company'

export class Invoice {
    invoice_id: number;
    transfer_id: number;
    invoice_date: string;
    invoice_status: string;
    invoice_total: number;
    
    // Related
    company: Company;
}