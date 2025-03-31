import { createReducer, on } from '@ngrx/store';
import { initialState, LoanState } from './loan.state';
import * as LoanActions from './loan.actions';

export const loanReducer = createReducer(
  initialState,
  on(LoanActions.loadLoansSuccess, (state, { loans }) => ({
    ...state,
    loans: loans,
  })),
  on(LoanActions.selectLoan, (state, { loanId }) => ({
    ...state,
    selectedLoan: state.loans.find((loan) => loan.LoanId === loanId) || null,
  })),
  on(LoanActions.addLoanSuccess, (state, { loan }) => ({
    ...state,
    loans: [...state.loans, loan],
  }))
);
