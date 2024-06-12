import { Attachment } from "./attachment";

export class TicketCommentAttachment {
    ticket_comment_attachment_uuid: string;
    ticket_comment_uuid: string;
    attachment_uuid: string;
    attachment: Attachment;
}