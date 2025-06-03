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
import { IAffordability, IAffordabilityRequest } from '../../../models/IAffordability';

describe('AffordabilityReducer', () => {
  let store: Store<AffordabilityState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ affordability: affordabilityReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should have initial state', () => {
    let currentState: AffordabilityState | undefined;
    store
      .select((state) => state)
      .subscribe((state) => {
        currentState = state;
      });

    expect(currentState).toEqual({
      result: null,
      isLoading: false,
      error: null,
    });
  });
    
    it('should set isLoading to true when calculateAffordability is dispatched', () => {
      const mockRequest: IAffordabilityRequest = {
        AnnualIncome: 50000,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 500,
      };

      store.dispatch(calculateAffordability({ request: mockRequest }));

      store
        .select((state) => state)
        .subscribe((state) => {
          expect(state.isLoading).toBe(true);
          expect(state.error).toBeNull();
        });
    });
      

  it('should update state correctly on calculateAffordabilitySuccess', () => {
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
      .select((state) => state)
      .subscribe((state) => {
        expect(state.result).toEqual(mockResult);
        expect(state.isLoading).toBeUndefined();
        expect(state.error).toBeUndefined();
      });
  });

  it('should update state correctly on calculateAffordabilityFailure', () => {
    const errorMessage = 'An error occurred';
    store.dispatch(calculateAffordabilityFailure({ error: errorMessage }));

    store
      .select((state) => state)
      .subscribe((state) => {
        expect(state.isLoading).toBeUndefined();
        expect(state.error).toBe(errorMessage);
      });
  });

  it('should reset state to initial state on resetAffordability', () => {
    // First, update the state
    store.dispatch(
      calculateAffordabilitySuccess({
        result: {
          MaxAffordableHomePrice: 300000,
          EstimatedLoanAmount: 240000,
          EstimatedMonthlyPayment: 1500,
          DtiPercentage: 0.36,
          AnnualIncome: 100000,
          DownPayment: 60000,
          LoanTermMonths: 360,
          InterestRate: 0.035,
          MonthlyDebts: 1000,
        },
      })
    );

    // Then reset
    store.dispatch(resetAffordability());

    store
      .select((state) => state)
      .subscribe((state) => {
        expect(state).toEqual({
          result: null,
          isLoading: false,
          error: null,
        });
      });
  });

it('should handle multiple actions in sequence', () => {
  const mockRequest: IAffordabilityRequest = {
    AnnualIncome: 100000,
    DownPayment: 60000,
    LoanTermMonths: 360,
    InterestRate: 0.035,
    MonthlyDebts: 1000,
  };

  store.dispatch(calculateAffordability({ request: mockRequest }));

  store.dispatch(
    calculateAffordabilitySuccess({
      result: {
        MaxAffordableHomePrice: 300000,
        EstimatedLoanAmount: 240000,
        EstimatedMonthlyPayment: 1500,
        DtiPercentage: 0.36,
        AnnualIncome: 100000,
        DownPayment: 60000,
        LoanTermMonths: 360,
        InterestRate: 0.035,
        MonthlyDebts: 1000,
      },
    })
  );

  store.dispatch(calculateAffordabilityFailure({ error: 'New error' }));

  store
    .select((state) => state)
    .subscribe((state) => {
      expect(state.result).toEqual({
        MaxAffordableHomePrice: 300000,
        EstimatedLoanAmount: 240000,
        EstimatedMonthlyPayment: 1500,
        DtiPercentage: 0.36,
        AnnualIncome: 100000,
        DownPayment: 60000,
        LoanTermMonths: 360,
        InterestRate: 0.035,
        MonthlyDebts: 1000,
      });
      expect(state.isLoading).toBeUndefined();
      expect(state.error).toBe('New error');
    });
});
      
    
  it('should not modify state for unhandled actions', () => {
    const initialState = {
      result: null,
      isLoading: false,
      error: null,
    };

    const unhandledAction = { type: 'UNHANDLED_ACTION' };
    const newState = affordabilityReducer(initialState, unhandledAction);

    expect(newState).toEqual(initialState);
  });

  // Edge Cases
  it('should handle edge case of zero values', () => {
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
      .select((state) => state)
      .subscribe((state) => {
        expect(state.result).toEqual(zeroResult);
        expect(state.isLoading).toBeUndefined();
        expect(state.error).toBeUndefined();
      });
  });

  it('should handle edge case of maximum safe integer values', () => {
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
      .select((state) => state)
      .subscribe((state) => {
        expect(state.result).toEqual(maxResult);
        expect(state.isLoading).toBeUndefined();
        expect(state.error).toBeUndefined();
      });
  });

  it('should handle edge case of negative values', () => {
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
      .select((state) => state)
      .subscribe((state) => {
        expect(state.result).toEqual(negativeResult);
        expect(state.isLoading).toBeUndefined();
        expect(state.error).toBeNull();
      });
  });
});
