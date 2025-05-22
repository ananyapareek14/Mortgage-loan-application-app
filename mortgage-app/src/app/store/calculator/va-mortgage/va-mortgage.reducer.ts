import { createReducer, on } from '@ngrx/store';
import {
  calculateVaMortgage,
  calculateVaMortgageSuccess,
  calculateVaMortgageFailure,
  resetVaMortgage
} from './va-mortgage.actions';
import { IVaMortgage } from '../../../models/IVaMortgage';

export interface VaMortgageState {
  result: IVaMortgage[] | null;
  loading: boolean;
  error: string | null;
}

export const initialState: VaMortgageState = {
  result: null,
  loading: false,
  error: null,
};

export const vaMortgageReducer = createReducer(
  initialState,
  on(calculateVaMortgage, (state) => ({
    ...state,
    loading: true,
    error: null,
    result: null,
  })),
  on(calculateVaMortgageSuccess, (state, { result }) => ({
    ...state,
    loading: false,
    result,
  })),
  on(calculateVaMortgageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(resetVaMortgage, () => initialState)
);