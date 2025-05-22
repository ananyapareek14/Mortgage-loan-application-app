import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DtiState } from './dti.reducer';

export const selectDtiState = createFeatureSelector<DtiState>('dti');

export const selectDtiResult = createSelector(
  selectDtiState,
  (state) => state.result
);

export const selectDtiLoading = createSelector(
  selectDtiState,
  (state) => state.loading
);

export const selectDtiError = createSelector(
  selectDtiState,
  (state) => state.error
);