import { selectAmortizationState, selectAmortizationSchedule, selectAmortizationLoading, selectAmortizationError } from './amortization.selectors';
import { AmortizationState } from './amortization.reducer';

describe('Amortization Selectors', () => {
  const initialState: AmortizationState = {
    schedule: null,
    loading: false,
    error: null,
    isLoading: false
  };

  it('should select the amortization state', () => {
    const result = selectAmortizationState.projector(initialState);

    expect(result).toEqual(initialState);
  });

  it('should select the amortization schedule', () => {
    const state = { ...initialState, schedule: [{ PaymentNumber: 1, PaymentDate: new Date(), MonthlyPayment: 1000, PrincipalPayment: 900, InterestPayment: 100, RemainingBalance: 9900 }] };
    const result = selectAmortizationSchedule.projector(state);

    expect(result).toEqual(state.schedule);
  });

  it('should select loading state', () => {
    const state = { ...initialState, isLoading: true };
    const result = selectAmortizationLoading.projector(state);

    expect(result).toBeTrue();
  });

  it('should select error state', () => {
    const error = 'Failed to load schedule';
    const state = { ...initialState, error };
    const result = selectAmortizationError.projector(state);

    expect(result).toBe(error);
  });
});
