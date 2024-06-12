import { Attachment } from "./attachment";

export class TicketAttachment {
    ticket_attachment_uuid: string; 
    ticket_uuid: string; 
    attachment_uuid: string;
    attachment: Attachment;
}