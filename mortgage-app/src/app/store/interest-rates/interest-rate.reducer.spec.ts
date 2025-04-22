import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { IInterestRate } from '../../models/IInterestRate';
import {
  loadInterestRates,
  loadInterestRatesFailure,
  loadInterestRatesSuccess,
} from './interest-rate.actions';
import {
  interestRateReducer,
  InterestRateState,
} from './interest-rate.reducer';

describe('InterestRateReducer', () => {
  let store: Store<InterestRateState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ interestRate: interestRateReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should return the initial state', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: false,
      error: null,
    };

    const action = { type: 'NOOP' };
    const state = interestRateReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should set loading to true when loadInterestRates action is dispatched', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: false,
      error: null,
    };

    const action = loadInterestRates();
    const state = interestRateReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state with interest rates when loadInterestRatesSuccess action is dispatched', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const mockInterestRates: IInterestRate[] = [
      { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
      { Id: '2', Rate: 4.75, ValidFrom: '2023-02-01' },
    ];

    const action = loadInterestRatesSuccess({
      interestRates: mockInterestRates,
    });
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates).toEqual(mockInterestRates);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set error and loading to false when loadInterestRatesFailure action is dispatched', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const errorMessage = 'Failed to load interest rates';
    const action = loadInterestRatesFailure({ error: errorMessage });
    const state = interestRateReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.interestRates).toEqual([]);
  });

  it('should handle empty array of interest rates', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const action = loadInterestRatesSuccess({ interestRates: [] });
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should not modify interest rates when loadInterestRates action is dispatched', () => {
    const initialInterestRates: IInterestRate[] = [
      { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
    ];
    const initialState: InterestRateState = {
      interestRates: initialInterestRates,
      loading: false,
      error: null,
    };

    const action = loadInterestRates();
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates).toEqual(initialInterestRates);
  });

  it('should handle very large number of interest rates', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const largeNumberOfRates: IInterestRate[] = Array(10000)
      .fill(null)
      .map((_, index) => ({
        Id: (index + 1).toString(),
        Rate: Math.random() * 10,
        ValidFrom: new Date(2023, 0, index + 1).toISOString().split('T')[0],
      }));

    const action = loadInterestRatesSuccess({
      interestRates: largeNumberOfRates,
    });
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates.length).toBe(10000);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle very long error messages', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const longErrorMessage = 'E'.repeat(10000);
    const action = loadInterestRatesFailure({ error: longErrorMessage });
    const state = interestRateReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(longErrorMessage);
    expect(state.error?.length).toBe(10000);
  });

  // New edge cases
  it('should handle interest rates with very high rates', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const highRateInterestRates: IInterestRate[] = [
      { Id: '1', Rate: 1000000, ValidFrom: '2023-01-01' },
      { Id: '2', Rate: 9999999.99, ValidFrom: '2023-02-01' },
    ];

    const action = loadInterestRatesSuccess({
      interestRates: highRateInterestRates,
    });
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates).toEqual(highRateInterestRates);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle interest rates with very low rates', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const lowRateInterestRates: IInterestRate[] = [
      { Id: '1', Rate: 0.0000001, ValidFrom: '2023-01-01' },
      { Id: '2', Rate: 0, ValidFrom: '2023-02-01' },
    ];

    const action = loadInterestRatesSuccess({
      interestRates: lowRateInterestRates,
    });
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates).toEqual(lowRateInterestRates);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle interest rates with invalid dates', () => {
    const initialState: InterestRateState = {
      interestRates: [],
      loading: true,
      error: null,
    };

    const invalidDateInterestRates: IInterestRate[] = [
      { Id: '1', Rate: 5.5, ValidFrom: 'invalid-date' },
      { Id: '2', Rate: 4.75, ValidFrom: '2023-13-01' },
    ];

    const action = loadInterestRatesSuccess({
      interestRates: invalidDateInterestRates,
    });
    const state = interestRateReducer(initialState, action);

    expect(state.interestRates).toEqual(invalidDateInterestRates);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
