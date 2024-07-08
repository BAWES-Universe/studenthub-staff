import { Injectable } from '@angular/core';
import { AuthHttpService } from "./authhttp.service";
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CandidateEvaluationService {

  public endPoint = '/candidate-evaluation';
  
  constructor(
    public authHttp: AuthHttpService
  ) { }

  /**
   * list question by dept id
   * @param deptID
   * @param page
   * @param param
   */
  listQuestionByDept(deptID,page,param) {
    let url = `${this.endPoint}/question-by-dept/${deptID}?page=${page}${param}`
    return this.authHttp.getRaw(url);
  }

  /**
   * list candidate report
   * @param candidateID
   * @param page
   * @param param
   */
  listReport(candidateID, page:number, param) {
    let url = `${this.endPoint}/list-report/${candidateID}?page=${page}${param}`
    return this.authHttp.getRaw(url);
  }

  /**
   * View report
   * @param canEvalUUID
   * @constructor
   */
  viewReport(canEvalUUID: string) {
    let url = `${this.endPoint}/report/${canEvalUUID}?expand=department,questionAnswer`;
    return this.authHttp.get(url);
  }

  /**
   * create question answer
   * @param data
   */
  create(data:any) {
    let url = `${this.endPoint}`
    return this.authHttp.post(url,{
      dept:data.dept,
      start_date:data.start_date,
      end_date:data.end_date,
      questionAnswer:data.questionAnswer,
      candidateID:data.candidateID,
    });
  }

  listDepartment() {
    return of(
      [
      {'id':1, 'name': 'Sales Associate'},
      {'id':2, 'name': 'IT'},
      {'id':3, 'name': 'Call Centre Agent'},
      {'id':4, 'name': 'Social Media'},
      {'id':5, 'name': 'Outdoor Sales Representative'}
      ]
    )
  }

  /**
   * download file
   * @param reportUUID
   * @param name
   */
  downloadReport(reportUUID,name) {
    let url = `${this.endPoint}/pdf/${reportUUID}`
    return this.authHttp.pdfget(url,name);
  }
}
