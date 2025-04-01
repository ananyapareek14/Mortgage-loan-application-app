// import { createAction, props } from '@ngrx/store';
// import { IInterestRate } from '../../models/IInterestRate';

// export const loadInterestRates = createAction('[Interest Rate] Load Interest Rates');
// export const loadInterestRatesSuccess = createAction('[Interest Rate] Load Interest Rates Success', props<{ interestRates: IInterestRate[] }>());
// export const loadInterestRatesFailure = createAction('[Interest Rate] Load Interest Rates Failure', props<{ error: string }>());


import { createAction, props } from '@ngrx/store';
import { IInterestRate } from '../../models/IInterestRate';

export const loadInterestRates = createAction(
  '[Interest Rate] Load Interest Rates'
);
export const loadInterestRatesSuccess = createAction(
  '[Interest Rate] Load Interest Rates Success',
  props<{ interestRates: IInterestRate[] }>()
);
export const loadInterestRatesFailure = createAction(
  '[Interest Rate] Load Interest Rates Failure',
  props<{ error: string }>()
);
