import {Story, StoryActivity} from './request';

export class Staff {
    staff_id: number;
    staff_name: string;
    staff_email: string;
    staff_photo: string;
    staff_notification: boolean | number;
    staff_job_title: string;
    staff_status: number;
    staff_created_at: string;
    staff_updated_at: string;
    activeStory: Story[];
    storyActivities: StoryActivity[];
    groupStoryActivities: StoryActivity[];
}

