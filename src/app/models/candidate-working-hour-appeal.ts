import { Candidate, CandidateWorkingHour } from "./candidate";
import { CandidateWorkingDate } from "./candidate-working-date";
import { CandidateWorkingHourAppealUpdates } from "./candidate-working-hour-appeal-updates";

export class CandidateWorkingHourAppeal {
  appeal_uuid: string;
  candidate_id: number;
  candidate_working_hour_uuid: string;
  candidate: Candidate;
  reason: string;
  status: number;
  correctedHours: CandidateWorkingHour[];
  originalHour: CandidateWorkingHour;
  created_at: string;
  updated_at: string;
  candidateWorkingHourAppealUpdates: CandidateWorkingHourAppealUpdates[];
  candidateWorkingDate: CandidateWorkingDate;
}