import { createReducer, on } from '@ngrx/store';
import {
  calculateAffordability,
  calculateAffordabilitySuccess,
  calculateAffordabilityFailure,
  resetAffordability,
} from './affordability.actions';
import { IAffordability } from '../../../models/IAffordability';

export interface AffordabilityState {
  result: IAffordability | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AffordabilityState = {
  result: null,
  isLoading: false,
  error: null,
};

export const affordabilityReducer = createReducer(
  initialState,
  on(calculateAffordability, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(calculateAffordabilitySuccess, (state, { result }) => ({
    ...state,
    result,
    isLoading: false,
    error: null,
  })),
  on(calculateAffordabilityFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(resetAffordability, () => initialState)
);
