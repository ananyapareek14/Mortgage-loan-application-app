import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  selectDtiState,
  selectDtiResult,
  selectDtiLoading,
  selectDtiError,
} from './dti.selectors';
import { dtiReducer, initialState } from './dti.reducer';
import { IDebtToIncome } from '../../../models/IDebt-To-Income';

describe('DTI Selectors', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('dti', dtiReducer),
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('selectDtiState', () => {
    it('should select the dti feature state', () => {
      const result = selectDtiState({
        dti: initialState,
      });
      expect(result).toEqual(initialState);
    });
  });

  describe('selectDtiResult', () => {
    it('should return the dti result when available', () => {
      const dtiResult: IDebtToIncome = {
        DtiPercentage: 0.35,
        TotalDebts: 1000,
        ProposedMonthlyPayment: 500,
        RemainingMonthlyIncome: 2000,
      };
      const state = { dti: { ...initialState, result: dtiResult } };
      const result = selectDtiResult(state);
      expect(result).toEqual(dtiResult);
    });

    it('should return undefined when no result is available', () => {
      const state = { dti: initialState };
      const result = selectDtiResult(state);
      expect(result).toBeUndefined();
    });
  });

  describe('selectDtiLoading', () => {
    it('should return true when loading is in progress', () => {
      const state = { dti: { ...initialState, loading: true } };
      const result = selectDtiLoading(state);
      expect(result).toBe(true);
    });

    it('should return false when loading is not in progress', () => {
      const state = { dti: { ...initialState, loading: false } };
      const result = selectDtiLoading(state);
      expect(result).toBe(false);
    });
  });

  describe('selectDtiError', () => {
    it('should return the error message when an error occurs', () => {
      const errorMessage = 'An error occurred';
      const state = { dti: { ...initialState, error: errorMessage } };
      const result = selectDtiError(state);
      expect(result).toBe(errorMessage);
    });

    it('should return null when no error occurs', () => {
      const state = { dti: initialState };
      const result = selectDtiError(state);
      expect(result).toBeNull();
    });
  });

  // Edge case: Empty state
  it('should handle empty state for all selectors', () => {
    const emptyState = {};
    expect(selectDtiState(emptyState)).toBeUndefined();
    expect(selectDtiResult(emptyState)).toBeUndefined();
    expect(selectDtiLoading(emptyState)).toBeUndefined();
    expect(selectDtiError(emptyState)).toBeUndefined();
  });

  // Edge case: Maximum values
  it('should handle maximum values for DTI result', () => {
    const maxDtiResult: IDebtToIncome = {
      DtiPercentage: Number.MAX_VALUE,
      TotalDebts: Number.MAX_VALUE,
      ProposedMonthlyPayment: Number.MAX_VALUE,
      RemainingMonthlyIncome: Number.MAX_VALUE,
    };
    const state = { dti: { ...initialState, result: maxDtiResult } };
    const result = selectDtiResult(state);
    expect(result).toEqual(maxDtiResult);
  });

  // Edge case: Minimum values
  it('should handle minimum values for DTI result', () => {
    const minDtiResult: IDebtToIncome = {
      DtiPercentage: 0,
      TotalDebts: 0,
      ProposedMonthlyPayment: 0,
      RemainingMonthlyIncome: 0,
    };
    const state = { dti: { ...initialState, result: minDtiResult } };
    const result = selectDtiResult(state);
    expect(result).toEqual(minDtiResult);
  });

  // Error handling: Invalid state structure
  it('should handle invalid state structure', () => {
    const invalidState = { dti: null };
    expect(() => selectDtiResult(invalidState)).not.toThrow();
    expect(selectDtiResult(invalidState)).toBeUndefined();
  });
});
