import { createAction, props } from '@ngrx/store';
import { IAffordability, IAffordabilityRequest } from '../../../models/IAffordability';

export const calculateAffordability = createAction(
  '[Affordability] Calculate Affordability',
  props<{ request: IAffordabilityRequest }>()
);

export const calculateAffordabilitySuccess = createAction(
  '[Affordability] Calculate Affordability Success',
  props<{ result: IAffordability }>()
);

export const calculateAffordabilityFailure = createAction(
  '[Affordability] Calculate Affordability Failure',
  props<{ error: string }>()
);

export const resetAffordability = createAction('[Affordability] Reset');