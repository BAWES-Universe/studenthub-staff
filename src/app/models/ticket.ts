import { TicketComment } from "./ticket_comment";
import { TicketAttachment } from "./ticket_attachment";
import { Candidate } from "./candidate";
import { Attachment } from "./attachment";

export class Ticket {
    ticket_uuid: string;
    restaurant_uuid: string;
    candidate_id: number;
    staff_id: number;
    ticket_detail: string;
    ticket_status: number;
    created_at: string;
    updated_at: string;
    ticketAttachments: TicketAttachment[];
    attachments: Attachment[];
    ticketComments: TicketComment[];
    staff: any;
    candidate: Candidate;
}
