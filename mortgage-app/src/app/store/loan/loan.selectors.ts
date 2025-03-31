import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoanState } from './loan.state';

export const selectLoanState = createFeatureSelector<LoanState>('loan');

export const selectLoans = createSelector(
  selectLoanState,
  (state) => state.loans
);

export const selectSelectedLoan = createSelector(
  selectLoanState,
  (state) => state.selectedLoan
);
