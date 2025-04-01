import { createReducer, on } from '@ngrx/store';
import { initialState, LoanState } from './loan.state';
import * as LoanActions from './loan.actions';

export const loanReducer = createReducer(
  initialState,

  // Load loans
  on(LoanActions.loadLoans, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  // on(LoanActions.loadLoansSuccess, (state, { loans }) => ({
  //   ...state,
  //   loans,
  //   loading: false,
  //   error: null,
  // }))
  on(LoanActions.loadLoansSuccess, (state, { loans }) => {
    console.log('🟢 Reducer: Updating state with loans', loans);
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

  // Select a loan
  on(LoanActions.selectLoan, (state, { loanId }) => ({
    ...state,
    selectedLoan: state.loans.find((loan) => loan.LoanId === loanId) || null,
  })),

  // Add a new loan
  on(LoanActions.addLoan, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(LoanActions.addLoanSuccess, (state, { loan }) => ({
    ...state,
    loans: [...state.loans, loan],
    loading: false,
    error: null,
  })),
  on(LoanActions.addLoanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
