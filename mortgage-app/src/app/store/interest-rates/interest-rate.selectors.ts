import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InterestRateState } from './interest-rate.reducer';

export const selectInterestRateState =
  createFeatureSelector<InterestRateState>('interestRates');

// export const selectAllInterestRates = createSelector(
//   selectInterestRateState,
//   (state) => state.interestRates
// );

export const selectAllInterestRates = createSelector(
  selectInterestRateState,
  (state: InterestRateState) => state.interestRates
);

// export const selectInterestRatesLoading = createSelector(
//   selectInterestRateState,
//   (state) => state.loading
// );

// export const selectInterestRatesError = createSelector(
//   selectInterestRateState,
//   (state) => state.error
// );

export const selectInterestRatesLoading = createSelector(
  selectInterestRateState,
  (state: InterestRateState) => state.loading
);

export const selectInterestRatesError = createSelector(
  selectInterestRateState,
  (state: InterestRateState) => state.error
);
