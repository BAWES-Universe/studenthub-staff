import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationFormService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  save(candidateId: number, payload: any): Observable<any> {
    return this.request('POST', '/interview-evaluation-form', {
      ...payload,
      candidate_id: candidateId
    });
  }

  update(uuid: string, payload: any): Observable<any> {
    return this.request('PATCH', '/interview-evaluation-form/' + uuid, payload);
  }

  history(uuid: string): Observable<any> {
    return this.request('GET', '/interview-evaluation-form/history/' + uuid);
  }

  presets(): Observable<any> {
    return this.request('GET', '/interview-evaluation-preset');
  }

  createPreset(name: string, schema: any): Observable<any> {
    return this.request('POST', '/interview-evaluation-preset', { name, schema });
  }

  savePresetFromEvaluation(uuid: string, name: string): Observable<any> {
    return this.request('POST', '/interview-evaluation-preset/from-evaluation/' + uuid, { name });
  }

  updatePreset(uuid: string, name: string, schema: any, expectedRevision: number): Observable<any> {
    return this.request('PATCH', '/interview-evaluation-preset/' + uuid, {
      name,
      schema,
      expected_revision: expectedRevision
    });
  }

  duplicatePreset(uuid: string): Observable<any> {
    return this.request('POST', '/interview-evaluation-preset/duplicate/' + uuid, {});
  }

  archivePreset(uuid: string, expectedRevision: number): Observable<any> {
    return this.request('POST', '/interview-evaluation-preset/archive/' + uuid, {
      expected_revision: expectedRevision
    });
  }

  private request(method: string, url: string, body?: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.auth.getAccessToken(),
      'Content-Type': 'application/json'
    });
    return this.http.request(method, environment.apiEndpoint + url, {
      body,
      headers
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error && (error.status === 409 || error.status === 403 || error.status === 422)) {
          return of(error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
