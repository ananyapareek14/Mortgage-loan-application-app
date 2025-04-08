import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan } from '../models/ILoan';
import { Store } from '@ngrx/store';
import { selectLoans, selectSelectedLoan } from '../store/loan/loan.selectors';
import * as LoanActions from '../store/loan/loan.actions';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { slideIn, slideOut, staggerList } from '../../animations';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [slideIn, slideOut, staggerList]
})

export class DashboardComponent implements OnInit {
  loans$: Observable<ILoan[]>;

  constructor(private store: Store, private router: Router) {
    this.loans$ = this.store.select(selectLoans);
  }

  ngOnInit() {
    this.store.dispatch(LoanActions.loadLoans());
  }

  selectLoan(loan: ILoan) {
    const userLoanNumber = loan.UserLoanNumber ?? 0;

    // Navigate to LoanDetailComponent using path parameter
    this.router.navigate(['/details', userLoanNumber]);
  }
}
