import { createReducer, on } from '@ngrx/store';
import * as DtiActions from './dti.actions';
import { IDebtToIncome } from '../../../models/IDebt-To-Income';

export interface DtiState {
  result: IDebtToIncome | null;
  loading: boolean;
  error: any;
}

export const initialState: DtiState = {
  result: null,
  loading: false,
  error: null,
};

export const dtiReducer = createReducer(
  initialState,
  on(DtiActions.calculateDti, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DtiActions.calculateDtiSuccess, (state, { result }) => ({
    ...state,
    loading: false,
    result,
  })),
  on(DtiActions.calculateDtiFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(DtiActions.resetDti, () => initialState)
);