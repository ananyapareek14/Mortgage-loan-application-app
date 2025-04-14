import { selectInterestRatesLoading, selectAllInterestRates, selectInterestRatesError } from './interest-rate.selectors';
import { InterestRateState } from './interest-rate.reducer';

describe('Interest Rate Selectors', () => {
  let state: InterestRateState;

  beforeEach(() => {
    state = {
      interestRates: [
        { Id: '1', Rate: 5.5, ValidFrom: '2021-01-01' },
        { Id: '2', Rate: 3.7, ValidFrom: '2021-06-01' }
      ],
      loading: true,
      error: null
    };
  });

  it('should select the correct interest rates', () => {
    const result = selectAllInterestRates.projector(state);
    expect(result).toEqual(state.interestRates);
  });

  it('should select the loading state', () => {
    const result = selectInterestRatesLoading.projector(state);
    expect(result).toBe(state.loading);
  });

  it('should select the error state', () => {
    const result = selectInterestRatesError.projector(state);
    expect(result).toBe(state.error);
  });
});
