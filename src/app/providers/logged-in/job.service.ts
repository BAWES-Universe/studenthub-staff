import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { Job } from 'src/app/models/job';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  private jobEndpoint = '/jobs';

  constructor(private authhttp: AuthHttpService) { }

  /**
   * view candidate interest in job 
   * @param job_interest_uuid 
   * @returns 
   */
  viewInterest(job_interest_uuid: string): Observable<any> {
    let url = this.jobEndpoint + '/interest/' + job_interest_uuid + '?expand=candidate,job,job.area,job.jobSkills,job.createdBy';
    return this.authhttp.get(url);
  }

  listInterestFilter(job_uuid: string): Observable<any> {
    let url = this.jobEndpoint + '/interests/filter?job_uuid=' + job_uuid;
    return this.authhttp.get(url);
  }

  /**
   * list candidate interests
   * @param page 
   * @param searchParams 
   * @returns 
   */
  listInterests(page: number = 1, searchParams: string = ''): Observable<any> {
    let url = this.jobEndpoint + '/interests?&page=' + page + searchParams + '&expand=candidate,job';
    return this.authhttp.getRaw(url);
  }

  /**
   * List of all jobs
   * @param page
   * @param searchParams
   */
  list(page: number = 1, searchParams: string = ''): Observable<any> {
    let url = this.jobEndpoint + '?&page=' + page + searchParams + '&expand=area,jobSkills,createdBy';
    return this.authhttp.getRaw(url);
  }

  /**
   * Return job detail
   * @param job
   */
  view(job): Observable<any> {
    const url = this.jobEndpoint + '/' + job.job_uuid + '?expand=area,jobSkills,createdBy';
    return this.authhttp.get(url);
  }

  /**
   * create job
   * @param model
   */
  create(model: Job): Observable<any>{
    return this.authhttp.post(this.jobEndpoint, model);
  }

  /**
   * update job
   * @param model
   */
  update(model: Job): Observable<any>{
    return this.authhttp.patch(`${this.jobEndpoint}/${model.job_uuid}`, model);
  }

  /**
   * delete job
   * @param model
   */
  delete(model: Job): Observable<any>{
    return this.authhttp.delete(`${this.jobEndpoint}/${model.job_uuid}`);
  }
}
