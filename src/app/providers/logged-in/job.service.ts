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
