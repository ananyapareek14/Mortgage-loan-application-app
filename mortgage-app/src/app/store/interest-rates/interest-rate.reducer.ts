import { createReducer, on } from '@ngrx/store';
import { IInterestRate } from '../../models/IInterestRate';
import { loadInterestRates, loadInterestRatesFailure, loadInterestRatesSuccess } from './interest-rate.actions';

export interface InterestRateState {
  interestRates: IInterestRate[];
  loading: boolean;
  error: string | null;
}

const initialState: InterestRateState = {
  interestRates: [],
  loading: false,
  error: null,
};

export const interestRateReducer = createReducer(
  initialState,
  on(loadInterestRates, (state) => ({ ...state, loading: true, error: null })),
  on(loadInterestRatesSuccess, (state, { interestRates }) => ({
    ...state,
    interestRates,
    loading: false,
  })),
  on(loadInterestRatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);