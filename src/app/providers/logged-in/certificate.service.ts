import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { CandidateCertificate } from 'src/app/models/certificate';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private _endpoint = '/certificates';

  constructor(private _authhttp: AuthHttpService) { }
 
  downloadCertificate(certificate_uuid: string): Observable<any> {
    let url = `${this._endpoint}/certificate/${certificate_uuid}`;
    return this._authhttp.pdfget(url, 'certification-' + certificate_uuid + '.pdf');
  }

  /**
   * list bank listing
   * @param page
   */
  list(page: number, urlParams: string = ""): Observable<any> {
    const url = this._endpoint + '?page=' + page + '&expand=store,company' + urlParams;
    return this._authhttp.getRaw(url);
  }

  fromWorkHistory(id: number, start_date = null, end_date = null): Observable<any> {
    const url = `${this._endpoint}/from-work-history/${id}`;
    return this._authhttp.post(url, {
      start_date: start_date,
      end_date: end_date
    });
  }

  create(certificate: CandidateCertificate): Observable<any> {
    const url = `${this._endpoint}`;
    return this._authhttp.post(url, certificate);
  }
  
  update(certificate: CandidateCertificate): Observable<any> {
    const url = `${this._endpoint}/${certificate.certificate_uuid}`;
    return this._authhttp.patch(url, certificate);
  }
  
  delete(certificate: CandidateCertificate): Observable<any> {
    const url = `${this._endpoint}/${certificate.certificate_uuid}`;
    return this._authhttp.delete(url);
  }
}
