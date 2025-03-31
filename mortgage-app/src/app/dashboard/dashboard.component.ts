import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoan } from '../models/ILoan';
import { LoanService } from '../services/loan/loan.service';
import { Store } from '@ngrx/store';
import { selectLoans } from '../store/loan/loan.selectors';
import * as LoanActions from '../store/loan/loan.actions';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  loans$: Observable<ILoan[]>;

  constructor(private store: Store, private loanService: LoanService) {
    this.loans$ = this.store.select(selectLoans);
  }

  ngOnInit() {
    this.store.dispatch(LoanActions.loadLoans());
    this.loanService.fetchLoans();
  }
}
