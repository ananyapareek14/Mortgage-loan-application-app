import { createAction, props } from '@ngrx/store';
import { ILoan } from '../../models/ILoan';

export const loadLoans = createAction('[Loan] Load Loans');
export const loadLoansSuccess = createAction(
  '[Loan] Load Loans Success',
  props<{ loans: ILoan[] }>()
);

export const selectLoan = createAction(
  '[Loan] Select Loan',
  props<{ loanId: number }>()
);

export const addLoan = createAction(
  '[Loan] Add Loan',
  props<{ loan: ILoan }>()
);
export const addLoanSuccess = createAction(
  '[Loan] Add Loan Success',
  props<{ loan: ILoan }>()
);
