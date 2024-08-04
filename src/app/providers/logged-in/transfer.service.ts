import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { Transfer } from 'src/app/models/transfer';
import { Invoice } from 'src/app/models/invoice';


@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private _transferEndpoint = '/transfers';

  public STATUS_PAYMENT_SENT = 1;
  public STATUS_SALARY_DISTRIBUTION_IN_PROGRESS = 3;
  public STATUS_TRANSFER_COMPLETE = 4;
  public STATUS_LOCK = 5;
  public STATUS_INITIATED = 10;

  constructor(private _authhttp: AuthHttpService) { }


  /**
   * list of Transfer
   * @returns {Observable<any>}
   */
  list(page, param): Observable<any> {
    const url = `${this._transferEndpoint}?page=${page}&${param}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * list of Transfer candidates
   * @returns {Observable<any>}
   */
  listCandidates(page, param): Observable<any> {
    const url = `${this._transferEndpoint}/candidates?page=${page}&${param}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * Details of each Transfer
   * @param {number} transfer_id
   * @returns {Observable<any>}
   */
  transferIdDetails(transfer_id: number, query: string = ''): Observable<any> {
    const url = `${this._transferEndpoint}/${transfer_id}?expand=transferCandidates,transferCandidates.candidate${query}`;//createdBy,updatedBy
    return this._authhttp.get(url);
  }

  /**
   * Make Transfer To Lock Transfer
   * @param transfer
   */
  makeTransfertoLock(transfer: Transfer): Observable<any> {
    const url = `${this._transferEndpoint}/lock/${transfer.transfer_id}`;
    return this._authhttp.patch(url, '');
  }
  
  /**
   * mark transfer as cancelled 
   * @param transfer 
   * @returns 
   */
  makeTransfertoCancel(transfer: Transfer): Observable<any> {
    const url = `${this._transferEndpoint}/cancel/${transfer.transfer_id}`;
    return this._authhttp.patch(url, '');
  }

  /**
   * Mark Invoice as Payment Sent
   * @param transfer
   */
  makePaymentSent(transfer: Transfer): Observable<any> {
    const url = `${this._transferEndpoint}/payment-sent/${transfer.transfer_id}`;
    return this._authhttp.patch(url, '');
  }

  /**
   * Generating Invoice copy
   * @param invoice
   */
  downloadInvoice(invoice: Invoice): Observable<any> {
    const url = `${this._transferEndpoint}/pdf/${invoice.invoice_id}`;
    return this._authhttp.pdfget(url, 'Invoice ' + invoice.invoice_id + '.pdf');
  }

  /**
   * Generating Invoice copy
   * @param invoice
   */
  downloadReceipt(invoice: Invoice): Observable<any> {
    const url = `${this._transferEndpoint}/pdf/${invoice.invoice_id}`;
    return this._authhttp.pdfget(url, 'Receipt ' + invoice.invoice_id + '.pdf');
  }

  /**
   * Save
   * @param { Transfer } transfer
   * @returns {Observable<any>}
   */
  save(transfer: Transfer, start_date, end_date, currency_code = "KWD"): Observable<any> {
    const postUrl = `${this._transferEndpoint}`;
    const params = {
      company_id: transfer.company_id,
      candidates: transfer.transferCandidates,
      start_date: start_date,
      end_date: end_date,
      currency_code: currency_code
    };
    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update or Edit Transfer Form
   * @param { Transfer } transfer
   * @returns { Observable<any> }
   */
  updateTransfer(transfer: Transfer, start_date, end_date, currency_code = "KWD"): Observable<any> {
    const postUrl = `${this._transferEndpoint}/${transfer.transfer_id}`;
    const params = {
      candidates: transfer.transferCandidates,
      start_date: start_date,
      end_date: end_date,
      currency_code: currency_code
    };
    return this._authhttp.patch(postUrl, params);
  }

  /**
   * Delete Transfer
   * @param transfer
   */
  delete(transfer: Transfer): Observable<any> {
    const url = `${this._transferEndpoint}/${transfer.transfer_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * download transfer Template
   */
  downloadTransferTemplate(id: number): Observable<any> {
    const url = `${this._transferEndpoint}/transfer-excel-template/${id}`;
    return this._authhttp.excelget(url, `transfer-template.xlsx`);
  }

  /**
   * download transfers
   */
  exportCompanyTransfer(param: any): Observable<any> {
    const url = `${this._transferEndpoint}/export-companies-transfer?${param}`;
    return this._authhttp.excelget(url, `transfer-list.xlsx`);
  }
  
  /**
   * download candidate transfers
   */
  exportCandidateTransfers(param: any): Observable<any> {
    const url = `${this._transferEndpoint}/export-candidate-transfers?${param}`;
    return this._authhttp.excelget(url, `candidate-transfer-list.xlsx`);
  }

  /**
   * upload excel file to create new transfer
   */
  uploadTransferExcel(file: string, start_date, end_date, company_id, currency_code = "KWD"): Observable<any> {
    const url = this._transferEndpoint + '/create-by-excel';
    return this._authhttp.uploadFile(url, {
      excel: file,
      start_date: start_date,
      end_date: end_date,
      company_id: company_id,
      currency_code: currency_code
    });
  }

  /**
   * upload excel file to edit transfer
   * @param file
   * @param transfer_id
   */
  updateTransferUploadExcel(file: string, transfer_id, start_date, end_date, currency_code = "KWD"): Observable<any> {
    const url = this._transferEndpoint + '/edit-by-excel/' + transfer_id;
    return this._authhttp.patch(url, {
      excel: file,
      start_date: start_date,
      end_date: end_date,
      currency_code: currency_code
    });
  }
}

