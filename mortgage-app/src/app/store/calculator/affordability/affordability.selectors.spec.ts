import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  selectAffordabilityState,
  selectAffordabilityResult,
  selectAffordabilityLoading,
  selectAffordabilityError,
} from './affordability.selectors';
import { AffordabilityState } from './affordability.reducer';
import { IAffordability } from '../../../models/IAffordability';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('Affordability Selectors', () => {
  let store: MockStore<{ affordability: AffordabilityState }>;

  const initialState: AffordabilityState = {
    result: null,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore<{ affordability: AffordabilityState }>({
          initialState: { affordability: initialState },
        }),
      ],
    });

    store = TestBed.inject(Store) as MockStore<{
      affordability: AffordabilityState;
    }>;
  });

  describe('selectAffordabilityState', () => {
    it('should select the affordability state', (done) => {
      store.select(selectAffordabilityState).subscribe((state) => {
        expect(state).toEqual(initialState);
        done();
      });
    });
  });

  describe('selectAffordabilityResult', () => {
    it('should select the affordability result when present', (done) => {
      const result: IAffordability = {
        MaxAffordableHomePrice: 300000,
        EstimatedLoanAmount: 240000,
        EstimatedMonthlyPayment: 1500,
        DtiPercentage: 0.28,
        AnnualIncome: 100000,
        DownPayment: 60000,
        LoanTermMonths: 360,
        InterestRate: 0.035,
        MonthlyDebts: 1000,
      };

      store.setState({
        affordability: {
          ...initialState,
          result,
        },
      });

      store.select(selectAffordabilityResult).subscribe((selectedResult) => {
        expect(selectedResult).toEqual(result);
        done();
      });
    });

    it('should return null when no result is present', (done) => {
      store.setState({ affordability: { ...initialState, result: null } });

      store.select(selectAffordabilityResult).subscribe((selectedResult) => {
        expect(selectedResult).toBeNull();
        done();
      });
    });
  });

  describe('selectAffordabilityLoading', () => {
    it('should select the loading state when true', (done) => {
      store.setState({ affordability: { ...initialState, isLoading: true } });

      store.select(selectAffordabilityLoading).subscribe((isLoading) => {
        expect(isLoading).toBe(true);
        done();
      });
    });

    it('should select the loading state when false', (done) => {
      store.setState({ affordability: { ...initialState, isLoading: false } });

      store.select(selectAffordabilityLoading).subscribe((isLoading) => {
        expect(isLoading).toBe(false);
        done();
      });
    });
  });

  describe('selectAffordabilityError', () => {
    it('should select the error when present', (done) => {
      const error = 'An error occurred';
      store.setState({ affordability: { ...initialState, error } });

      store.select(selectAffordabilityError).subscribe((selectedError) => {
        expect(selectedError).toBe(error);
        done();
      });
    });

    it('should return null when no error is present', (done) => {
      store.setState({ affordability: { ...initialState, error: null } });

      store.select(selectAffordabilityError).subscribe((selectedError) => {
        expect(selectedError).toBeNull();
        done();
      });
    });
  });

  it('should handle empty state', (done) => {
    store.setState({ affordability: initialState });

    store.select(selectAffordabilityState).subscribe((state) => {
      expect(state).toEqual(initialState);
      done();
    });
  });

  it('should handle maximum values', (done) => {
    const maxResult: IAffordability = {
      MaxAffordableHomePrice: Number.MAX_SAFE_INTEGER,
      EstimatedLoanAmount: Number.MAX_SAFE_INTEGER,
      EstimatedMonthlyPayment: Number.MAX_SAFE_INTEGER,
      DtiPercentage: 1,
      AnnualIncome: Number.MAX_SAFE_INTEGER,
      DownPayment: Number.MAX_SAFE_INTEGER,
      LoanTermMonths: Number.MAX_SAFE_INTEGER,
      InterestRate: 1,
      MonthlyDebts: Number.MAX_SAFE_INTEGER,
    };

    store.setState({
      affordability: { ...initialState, result: maxResult },
    });

    store.select(selectAffordabilityResult).subscribe((selectedResult) => {
      expect(selectedResult).toEqual(maxResult);
      done();
    });
  });

  it('should handle minimum values', (done) => {
    const minResult: IAffordability = {
      MaxAffordableHomePrice: 0,
      EstimatedLoanAmount: 0,
      EstimatedMonthlyPayment: 0,
      DtiPercentage: 0,
      AnnualIncome: 0,
      DownPayment: 0,
      LoanTermMonths: 0,
      InterestRate: 0,
      MonthlyDebts: 0,
    };

    store.setState({
      affordability: { ...initialState, result: minResult },
    });

    store.select(selectAffordabilityResult).subscribe((selectedResult) => {
      expect(selectedResult).toEqual(minResult);
      done();
    });
  });

  it('should handle undefined state', (done) => {
    (store as any).setState({ affordability: undefined });

    store.select(selectAffordabilityState).subscribe((state) => {
      expect(state).toBeUndefined();
      done();
    });
  });
});
