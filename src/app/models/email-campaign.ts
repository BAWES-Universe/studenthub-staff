import { EmailCampaignFilter } from "./email-campaign-filter";

export class EmailCampaign {
    campaign_uuid: string; 
    subject: string; 
    message: string; 
    progress: number; 
    status: number;
    created_at: string; 
    updated_at: string; 
    emailCampaignFilters: EmailCampaignFilter[];
}