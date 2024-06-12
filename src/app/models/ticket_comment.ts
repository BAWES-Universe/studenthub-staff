import { Attachment } from "./attachment";
import { TicketCommentAttachment } from "./ticket_comment_attachment";

export class TicketComment
{
    ticket_comment_uuid:  string;
    ticket_uuid:  string;
    status:  number;
    candidate_id:  number;
    staff_id: number;
    ticket_comment_detail: string;
    created_at: string;
    updated_at: string;
    attachments: Attachment[];
    ticketCommentAttachments: TicketCommentAttachment[];
}
