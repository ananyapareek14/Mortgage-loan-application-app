import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan } from '../models/ILoan';
import { Store } from '@ngrx/store';
import { selectLoans, selectSelectedLoan } from '../store/loan/loan.selectors';
import * as LoanActions from '../store/loan/loan.actions';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
// export class DashboardComponent implements OnInit {
//   loans$: Observable<ILoan[]>;
//   selectedLoan$: Observable<ILoan | null>;

//   constructor(private store: Store) {
//     this.loans$ = this.store.select(selectLoans);
//     this.selectedLoan$ = this.store.select(
//       selectSelectedLoan
//     ) as Observable<ILoan | null>;
//   }

//   ngOnInit() {
//     this.store.dispatch(LoanActions.loadLoans());
//   }

//   selectLoan(loan: ILoan) {
//     const loanId = loan.LoanId ?? 0;
//     this.store.dispatch(LoanActions.selectLoan({ loanId }));
//   }

//   // fetchAmortization(loanId: number) {
//   //   this.amortization$ = this.loanService.getAmortizationSchedule(loanId);
//   // }
// }

export class DashboardComponent implements OnInit {
  loans$: Observable<ILoan[]>;

  constructor(private store: Store, private router: Router) {
    this.loans$ = this.store.select(selectLoans);
  }

  ngOnInit() {
    this.store.dispatch(LoanActions.loadLoans());
  }

  selectLoan(loan: ILoan) {
    const loanId = loan.LoanId ?? 0;

    // Navigate to LoanDetailComponent using path parameter
    this.router.navigate(['/dashboard', loanId]);
  }
}
