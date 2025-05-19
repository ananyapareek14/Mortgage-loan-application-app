import { createAction, props } from '@ngrx/store';
import { IRefinance, IRefinanceRequest } from '../../../models/IRefinance';

export const calculateRefinance = createAction(
  '[Refinance] Calculate Refinance',
  props<{ request: IRefinanceRequest }>()
);

export const calculateRefinanceSuccess = createAction(
  '[Refinance] Calculate Refinance Success',
  props<{ result: IRefinance }>()
);

export const calculateRefinanceFailure = createAction(
  '[Refinance] Calculate Refinance Failure',
  props<{ error: string }>()
);

export const resetRefinance = createAction('[Refinance] Reset');
