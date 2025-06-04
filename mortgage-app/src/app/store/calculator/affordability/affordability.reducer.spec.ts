import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  affordabilityReducer,
  AffordabilityState,
} from './affordability.reducer';
import {
  calculateAffordability,
  calculateAffordabilitySuccess,
  calculateAffordabilityFailure,
  resetAffordability,
} from './affordability.actions';
import {
  IAffordability,
  IAffordabilityRequest,
} from '../../../models/IAffordability';

describe('AffordabilityReducer', () => {
  let store: Store<{ affordability: AffordabilityState }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ affordability: affordabilityReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should have initial state', (done) => {
    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state).toEqual({
          result: null,
          isLoading: false,
          error: null,
        });
        done();
      });
  });

  it('should set isLoading to true when calculateAffordability is dispatched', (done) => {
    const mockRequest: IAffordabilityRequest = {
      AnnualIncome: 50000,
      DownPayment: 20000,
      LoanTermMonths: 360,
      InterestRate: 3.5,
      MonthlyDebts: 500,
    };

    store.dispatch(calculateAffordability({ request: mockRequest }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
        done();
      });
  });

  it('should update state correctly on calculateAffordabilitySuccess', (done) => {
    const mockResult: IAffordability = {
      MaxAffordableHomePrice: 300000,
      EstimatedLoanAmount: 240000,
      EstimatedMonthlyPayment: 1500,
      DtiPercentage: 0.36,
      AnnualIncome: 100000,
      DownPayment: 60000,
      LoanTermMonths: 360,
      InterestRate: 0.035,
      MonthlyDebts: 1000,
    };

    store.dispatch(calculateAffordabilitySuccess({ result: mockResult }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.result).toEqual(mockResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        done();
      });
  });

  it('should update state correctly on calculateAffordabilityFailure', (done) => {
    const errorMessage = 'An error occurred';
    store.dispatch(calculateAffordabilityFailure({ error: errorMessage }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        done();
      });
  });

  it('should reset state to initial state on resetAffordability', (done) => {
    const mockResult: IAffordability = {
      MaxAffordableHomePrice: 300000,
      EstimatedLoanAmount: 240000,
      EstimatedMonthlyPayment: 1500,
      DtiPercentage: 0.36,
      AnnualIncome: 100000,
      DownPayment: 60000,
      LoanTermMonths: 360,
      InterestRate: 0.035,
      MonthlyDebts: 1000,
    };

    store.dispatch(calculateAffordabilitySuccess({ result: mockResult }));
    store.dispatch(resetAffordability());

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state).toEqual({
          result: null,
          isLoading: false,
          error: null,
        });
        done();
      });
  });

  it('should handle multiple actions in sequence', (done) => {
    const mockRequest: IAffordabilityRequest = {
      AnnualIncome: 100000,
      DownPayment: 60000,
      LoanTermMonths: 360,
      InterestRate: 0.035,
      MonthlyDebts: 1000,
    };

    const mockResult: IAffordability = {
      MaxAffordableHomePrice: 300000,
      EstimatedLoanAmount: 240000,
      EstimatedMonthlyPayment: 1500,
      DtiPercentage: 0.36,
      AnnualIncome: 100000,
      DownPayment: 60000,
      LoanTermMonths: 360,
      InterestRate: 0.035,
      MonthlyDebts: 1000,
    };

    store.dispatch(calculateAffordability({ request: mockRequest }));
    store.dispatch(calculateAffordabilitySuccess({ result: mockResult }));
    store.dispatch(calculateAffordabilityFailure({ error: 'New error' }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.result).toEqual(mockResult); // result shouldn't be overwritten by failure
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('New error');
        done();
      });
  });

  it('should not modify state for unhandled actions', () => {
    const initialState: AffordabilityState = {
      result: null,
      isLoading: false,
      error: null,
    };

    const unhandledAction = { type: 'UNHANDLED_ACTION' } as any;
    const newState = affordabilityReducer(initialState, unhandledAction);

    expect(newState).toEqual(initialState);
  });

  // Edge Cases
  it('should handle edge case of zero values', (done) => {
    const zeroResult: IAffordability = {
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

    store.dispatch(calculateAffordabilitySuccess({ result: zeroResult }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.result).toEqual(zeroResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        done();
      });
  });

  it('should handle edge case of maximum safe integer values', (done) => {
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

    store.dispatch(calculateAffordabilitySuccess({ result: maxResult }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.result).toEqual(maxResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        done();
      });
  });

  it('should handle edge case of negative values', (done) => {
    const negativeResult: IAffordability = {
      MaxAffordableHomePrice: -100000,
      EstimatedLoanAmount: -80000,
      EstimatedMonthlyPayment: -500,
      DtiPercentage: -0.5,
      AnnualIncome: -50000,
      DownPayment: -20000,
      LoanTermMonths: -360,
      InterestRate: -0.05,
      MonthlyDebts: -1000,
    };

    store.dispatch(calculateAffordabilitySuccess({ result: negativeResult }));

    store
      .select((state) => state.affordability)
      .subscribe((state) => {
        expect(state.result).toEqual(negativeResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        done();
      });
  });
});
