import { createAction, props } from '@ngrx/store';
import { IDebtToIncome, IDebtToIncomeRequest } from '../../../models/IDebt-To-Income';


export const calculateDti = createAction(
  '[DTI] Calculate',
  props<{ request: IDebtToIncomeRequest }>()
);

export const calculateDtiSuccess = createAction(
  '[DTI] Calculate Success',
  props<{ result: IDebtToIncome }>()
);

export const calculateDtiFailure = createAction(
  '[DTI] Calculate Failure',
  props<{ error: any }>()
);

export const resetDti = createAction('[DTI] Reset');