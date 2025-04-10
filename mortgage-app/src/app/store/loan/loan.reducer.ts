import { createReducer, on } from '@ngrx/store';
import { initialState } from './loan.state';
import * as LoanActions from './loan.actions';

export const loanReducer = createReducer(
  initialState,

  on(LoanActions.loadLoans, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LoanActions.loadLoansSuccess, (state, { loans }) => {
    return {
      ...state,
      loans: loans,
    };
  }),
  on(LoanActions.loadLoansFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LoanActions.addLoan, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LoanActions.addLoanSuccess, (state, { loan }) => ({
    ...state,
    loans: [...state.loans, loan],
    lastAddedLoan: loan,
    loading: false,
    error: null,
  })),

  on(LoanActions.addLoanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LoanActions.loadLoanById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LoanActions.loadLoanByIdSuccess, (state, { loan }) => ({
    ...state,
    selectedLoan: loan,
    loading: false,
  })),

  on(LoanActions.loadLoanByIdFailure, (state, { error }) => ({
    ...state,
    selectedLoan: null,
    loading: false,
    error,
  })),

  on(LoanActions.clearLastAddedLoan, (state) => ({
  ...state,
  lastAddedLoan: null,
  })),
);
