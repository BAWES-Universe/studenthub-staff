import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';
import {Expense} from "../../models/expense";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private endpoint = '/staff-expenses';

  constructor(private authHttp: AuthHttpService) { }

  /**
   * load Mall detail
   * @param mallUUID
   */
  view(mallUUID) {
    return this.authHttp.get(this.endpoint + '/' + mallUUID + '?expand=candidates,stores,stores.candidatesCount');
  }

  /**
   * List of all Expenses
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    return this.authHttp.getRaw(this.endpoint + '?page=' + page);
  }

  /**
   * List of all Expense
   * @returns {Observable<any>}
   */
  fullList(): Observable<any>{
    return this.authHttp.get(this.endpoint + '/all');
  }

  /**
   * create Expense
   * @param model
   */
  create(model: Expense): Observable<any>{

    return this.authHttp.post(this.endpoint, {
      supplier: model.supplier,
      category: model.category,
      purchase_date: model.purchase_date,
      total_amount: model.total_amount,
      currency: model.currency,
      vat: model.vat,
      reimbursable: model.reimbursable,
      description: model.description,
      file: model.file,
    });
  }

  /**
   * update Expense
   * @param model
   */
  update(model: Expense): Observable<any>{
    return this.authHttp.patch(`${this.endpoint}/${model.staff_expense_uuid}`, {
      supplier: model.supplier,
      category: model.category,
      purchase_date: model.purchase_date,
      total_amount: model.total_amount,
      currency: model.currency,
      vat: model.vat,
      reimbursable: model.reimbursable,
      description: model.description,
      file: model.file,
    });
  }

  /**
   * delete Expense
   * @param model
   */
  delete(model: Expense): Observable<any>{
    return this.authHttp.delete(`${this.endpoint}/${model.staff_expense_uuid}`);
  }
}
