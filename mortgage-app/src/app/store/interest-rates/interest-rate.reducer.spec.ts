import { interestRateReducer } from './interest-rate.reducer';
import * as fromActions from './interest-rate.actions';
import { IInterestRate } from '../../models/IInterestRate';

describe('Interest Rate Reducer', () => {
  const initialState = {
    interestRates: [],
    loading: false,
    error: null,
  };

  it('should return the default state', () => {
    const result = interestRateReducer(undefined, { type: '@ngrx/store/init' });
    expect(result).toEqual(initialState);
  });

  it('should set loading to true when loadInterestRates is triggered', () => {
    const action = fromActions.loadInterestRates();
    const result = interestRateReducer(initialState, action);
    expect(result.loading).toBeTrue();
  });

  it('should load interest rates successfully', () => {
    const interestRates: IInterestRate[] = [
      { Id: '1', Rate: 5, ValidFrom: '2021-01-01' },
    ];
    const action = fromActions.loadInterestRatesSuccess({ interestRates });
    const result = interestRateReducer(initialState, action);
    expect(result.interestRates).toEqual(interestRates);
    expect(result.loading).toBeFalse();
  });

  it('should handle loadInterestRatesFailure', () => {
    const error = 'Failed to load interest rates';
    const action = fromActions.loadInterestRatesFailure({ error });
    const result = interestRateReducer(initialState, action);
    expect(result.error).toEqual(error);
    expect(result.loading).toBeFalse();
  });
});
