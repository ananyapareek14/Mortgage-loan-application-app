import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as LoanActions from '../../store/loan/loan.actions';
import { ILoan } from '../../models/ILoan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store) {}

  fetchLoans() {
    this.http.get<ILoan[]>(`${this.apiUrl}/loans`).subscribe((loans) => {
      this.store.dispatch(LoanActions.loadLoansSuccess({ loans }));
      console.log(loans);
    });
  }

  createLoan(loan: ILoan) {
    this.http.post<ILoan>(`${this.apiUrl}/loans`, loan).subscribe((newLoan) => {
      this.store.dispatch(LoanActions.addLoanSuccess({ loan: newLoan }));
    });
  }
}
