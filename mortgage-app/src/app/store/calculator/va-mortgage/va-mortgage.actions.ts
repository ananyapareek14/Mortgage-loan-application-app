import { createAction, props } from '@ngrx/store';
import { IVaMortgage, IVaMortgageRequest } from '../../../models/IVaMortgage';

export const calculateVaMortgage = createAction(
  '[VA Mortgage] Calculate',
  props<{ request: IVaMortgageRequest }>()
);

export const calculateVaMortgageSuccess = createAction(
  '[VA Mortgage] Calculate Success',
  props<{ result: IVaMortgage[] }>()
);

export const calculateVaMortgageFailure = createAction(
  '[VA Mortgage] Calculate Failure',
  props<{ error: string | null }>()
);

export const resetVaMortgage = createAction('[VA Mortgage] Reset');