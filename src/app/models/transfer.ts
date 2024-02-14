import { TransferCandidate } from './transfer-candidate';
import { Candidate } from './candidate';

export class Transfer {
	transfer_id: number;
	parent_transfer_id: number;
	company_id: number;
	total: number;
	company_total: any;
	payment_received_on: string;
	start_date: string;
  end_date: string;
	transfer_status: number;
	transfer_created_at: string;
	transfer_updated_at: string;
	transfer_updated_at_unix: any;
	transfer_created_at_unix: any;
	company_name: string;
	company_email: string;
	total_transfer_cost: number;
	currency_code: string;
	
	//extra field
	totalPaid: number;
	totalUnpaid: number;
	profit: any;
	totalCandidateTransferTotal: number;
	paidTransferCandidates: [];
	candidates: Candidate[];
	transferCandidates: TransferCandidate[];
	invoices: Invoice[];
}

export class Invoice {
	invoice_id: number;
	transfer_id: number;
	invoice_date: string;
	invoice_status: string;
	invoice_total: number;
}
