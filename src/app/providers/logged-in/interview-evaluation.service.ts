import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { InterviewEvaluation, InterviewEvaluationNote, InterviewEvaluationNoteVersion } from 'src/app/models/interview-evaluation';
import { Note } from 'src/app/models/note';


@Injectable({
  providedIn: 'root'
})
export class InterviewEvaluationService {

  private endpoint = '/interview-evaluations';

  constructor(private authhttp: AuthHttpService) { }
 
  /**
   * @param page 
   * @returns 
   */
  list(page: number = 1, urlParams: string = ""): Observable<any> {
    const url = this.endpoint + '?page=' + page + urlParams + '&expand=latestInterviewEvaluationNoteVersions,latestInterviewEvaluationNoteVersions.staff,latestInterviewEvaluationNoteVersions.interviewEvaluationNotes,staff,request,company';//notes,
    return this.authhttp.getRaw(url);
  }

  /**
   * list note versions
   * @param interview_evaluation_uuid 
   * @param page 
   * @returns 
   */
  listVersions(interview_evaluation_uuid: string, page: number = 1): Observable<any> {
    const url = this.endpoint + '/versions/' + interview_evaluation_uuid + '?page=' + page + '&expand=staff,interviewEvaluationNotes';
    return this.authhttp.getRaw(url);
  }

  /**
   * @param interview_evaluation_uuid 
   * @returns 
   */
  view(interview_evaluation_uuid: string): Observable<any> {
    const url = this.endpoint + '/' + interview_evaluation_uuid + '?expand=interviewEvaluationNoteVersions.staff,interviewEvaluationNoteVersions,interviewEvaluationNoteVersions.interviewEvaluationNotes,staff,request,company';
    return this.authhttp.get(url);
  }

  /**
   * @param model 
   * @returns 
   */
  create(model: InterviewEvaluation, interviewEvaluationNotes: InterviewEvaluationNote[]): Observable<any>{
    return this.authhttp.post(this.endpoint, {
      ...model,
      interviewEvaluationNotes: interviewEvaluationNotes
    });
  }

  /**
   * @param model 
   * @returns 
   */
  update(model: InterviewEvaluation, interviewEvaluationNotes: InterviewEvaluationNote[]): Observable<any>{
    return this.authhttp.patch(this.endpoint + "/" + model.interview_evaluation_uuid, {
      ...model,
      interviewEvaluationNotes: interviewEvaluationNotes
    });
  }

  /**
   * @param interview_evaluation_uuid 
   * @param noteVersion 
   * @returns 
   */
  addNewVersion(interview_evaluation_uuid: string, noteVersion: InterviewEvaluationNoteVersion) {
    return this.authhttp.patch(this.endpoint + "/add-new-version/" + interview_evaluation_uuid, noteVersion);
  }

  /**
   * @param interview_evaluation_uuid 
   * @param note 
   * @returns 
   */
  addNote(interview_evaluation_uuid: string, note: Note) {
    return this.authhttp.patch(this.endpoint + "/add-note/" + interview_evaluation_uuid, note);
  }

  /**
   * @param interview_evaluation_uuid 
   * @returns 
   */
  delete(interview_evaluation_uuid: string): Observable<any>{
    return this.authhttp.delete(this.endpoint + "/" + interview_evaluation_uuid);
  }
}
