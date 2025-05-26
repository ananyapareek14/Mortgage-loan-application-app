import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { refinanceReducer, RefinanceState } from './refinance.reducer';
import {
  calculateRefinance,
  calculateRefinanceSuccess,
  calculateRefinanceFailure,
  resetRefinance,
} from './refinance.actions';
import { IRefinance, IRefinanceRequest } from '../../../models/IRefinance';

describe('Refinance Reducer', () => {
  let store: Store<{ refinance: RefinanceState }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ refinance: refinanceReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should have initial state', () => {
    let currentState: RefinanceState | undefined;
    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        currentState = state;
      });

    expect(currentState).toEqual({
      result: null,
      isLoading: false,
      error: null,
    });
  });

    it('should set isLoading to true when calculateRefinance action is dispatched', () => {
        const mockRequest: IRefinanceRequest = {
          CurrentLoanAmount: 200000,
          InterestRate: 5,
          CurrentTermMonths: 360,
          OriginationYear: 2020,
          NewLoanAmount: 195000,
          NewInterestRate: 4.5,
          NewTermMonths: 300,
          RefinanceFees: 2000,
        };
    store.dispatch(calculateRefinance({request: mockRequest}));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });
  });

  it('should update state correctly when calculateRefinanceSuccess action is dispatched', () => {
    const mockResult: IRefinance = {
      MonthlySavings: 100,
      NewPayment: 1000,
      BreakEvenMonths: 24,
      LifetimeSavings: 50000,
    };
    store.dispatch(calculateRefinanceSuccess({ result: mockResult }));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.result).toEqual(mockResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
  });

  it('should update state correctly when calculateRefinanceFailure action is dispatched', () => {
    const errorMessage = 'An error occurred';
    store.dispatch(calculateRefinanceFailure({ error: errorMessage }));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.error).toBe(errorMessage);
        expect(state.isLoading).toBe(false);
        expect(state.result).toBeNull();
      });
  });

  it('should reset state to initial state when resetRefinance action is dispatched', () => {
    // First, update the state
    store.dispatch(
      calculateRefinanceSuccess({
        result: {
          MonthlySavings: 100,
          NewPayment: 1000,
          BreakEvenMonths: 24,
          LifetimeSavings: 50000,
        },
      })
    );

    // Then reset
    store.dispatch(resetRefinance());

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state).toEqual({
          result: null,
          isLoading: false,
          error: null,
        });
      });
  });
    
    it('should handle multiple actions in sequence', () => {
      const mockRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 5,
        CurrentTermMonths: 360,
        OriginationYear: 2020,
        NewLoanAmount: 195000,
        NewInterestRate: 4.5,
        NewTermMonths: 300,
        RefinanceFees: 2000,
      };

      store.dispatch(calculateRefinance({ request: mockRequest }));

      store.dispatch(
        calculateRefinanceSuccess({
          result: {
            MonthlySavings: 200,
            NewPayment: 2000,
            BreakEvenMonths: 36,
            LifetimeSavings: 100000,
          },
        })
      );

      store.dispatch(calculateRefinanceFailure({ error: 'New error' }));

      store
        .select((state) => state.refinance)
        .subscribe((state) => {
          expect(state.isLoading).toBe(false);
          expect(state.result).toBeNull();
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
    const newState = refinanceReducer(initialState, unhandledAction);

    expect(newState).toEqual(initialState);
  });

  // Edge cases
  it('should handle calculateRefinanceSuccess with zero values', () => {
    const zeroResult: IRefinance = {
      MonthlySavings: 0,
      NewPayment: 0,
      BreakEvenMonths: 0,
      LifetimeSavings: 0,
    };
    store.dispatch(calculateRefinanceSuccess({ result: zeroResult }));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.result).toEqual(zeroResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
  });

  it('should handle calculateRefinanceSuccess with negative values', () => {
    const negativeResult: IRefinance = {
      MonthlySavings: -100,
      NewPayment: 1000,
      BreakEvenMonths: -24,
      LifetimeSavings: -50000,
    };
    store.dispatch(calculateRefinanceSuccess({ result: negativeResult }));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.result).toEqual(negativeResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
  });

  it('should handle calculateRefinanceSuccess with very large values', () => {
    const largeResult: IRefinance = {
      MonthlySavings: Number.MAX_SAFE_INTEGER,
      NewPayment: Number.MAX_SAFE_INTEGER,
      BreakEvenMonths: Number.MAX_SAFE_INTEGER,
      LifetimeSavings: Number.MAX_SAFE_INTEGER,
    };
    store.dispatch(calculateRefinanceSuccess({ result: largeResult }));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.result).toEqual(largeResult);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
  });

  it('should handle calculateRefinanceFailure with empty string error', () => {
    store.dispatch(calculateRefinanceFailure({ error: '' }));

    store
      .select((state) => state.refinance)
      .subscribe((state) => {
        expect(state.error).toBe('');
        expect(state.isLoading).toBe(false);
        expect(state.result).toBeNull();
      });
  });
});
