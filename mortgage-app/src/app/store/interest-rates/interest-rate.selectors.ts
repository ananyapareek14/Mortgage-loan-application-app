import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InterestRateState } from './interest-rate.reducer';

export const selectInterestRateState =
  createFeatureSelector<InterestRateState>('interestRates');

export const selectAllInterestRates = createSelector(
  selectInterestRateState,
  (state: InterestRateState | undefined) => state?.interestRates ?? []
);

export const selectInterestRatesLoading = createSelector(
  selectInterestRateState,
  (state: InterestRateState | undefined) => state?.loading
);

export const selectInterestRatesError = createSelector(
  selectInterestRateState,
  (state: InterestRateState | undefined) => state?.error
);
