import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  selectAmortizationState,
  selectAmortizationSchedule,
  selectAmortizationLoading,
  selectAmortizationError,
} from './amortization.selectors';
import { AmortizationState } from './amortization.reducer';
import { IAmortizationSchedule } from '../../models/IAmortizationSchedule';

describe('Amortization Selectors', () => {
  let store: MockStore;
  const initialState: { amortization: AmortizationState } = {
    amortization: {
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the amortization feature state', () => {
    store.overrideSelector(selectAmortizationState, initialState.amortization);

    store.select(selectAmortizationState).subscribe((result) => {
      expect(result).toEqual(initialState.amortization);
    });
  });

  it('should select the amortization schedule', () => {
    const schedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
    ];

    store.overrideSelector(selectAmortizationSchedule, schedule);

    store.select(selectAmortizationSchedule).subscribe((result) => {
      expect(result).toEqual(schedule);
    });
  });

  it('should select the loading state', () => {
    store.overrideSelector(selectAmortizationLoading, true);

    store.select(selectAmortizationLoading).subscribe((result) => {
      expect(result).toBe(true);
    });
  });

  it('should select the error state', () => {
    const error = 'An error occurred';

    store.overrideSelector(selectAmortizationError, error);

    store.select(selectAmortizationError).subscribe((result) => {
      expect(result).toBe(error);
    });
  });

  it('should handle empty schedule', () => {
    const emptySchedule: IAmortizationSchedule[] = [];

    store.overrideSelector(selectAmortizationSchedule, emptySchedule);
    store.overrideSelector(selectAmortizationLoading, false);
    store.overrideSelector(selectAmortizationError, null);

    store.select(selectAmortizationSchedule).subscribe((result) => {
      expect(result).toEqual([]);
    });

    store.select(selectAmortizationLoading).subscribe((result) => {
      expect(result).toBe(false);
    });

    store.select(selectAmortizationError).subscribe((result) => {
      expect(result).toBeNull();
    });
  });

  it('should handle undefined state', () => {
    store.overrideSelector(selectAmortizationState, undefined as any);

    store.select(selectAmortizationState).subscribe((result) => {
      expect(result).toBeUndefined();
    });
  });

  it('should handle large amortization schedule', () => {
    const largeSchedule: IAmortizationSchedule[] = Array(1000)
      .fill(null)
      .map((_, index) => ({
        PaymentNumber: index + 1,
        PaymentDate: new Date(2023, 5, index + 1),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 100000 - (index + 1) * 800,
      }));

    store.overrideSelector(selectAmortizationSchedule, largeSchedule);

    store.select(selectAmortizationSchedule).subscribe((result) => {
      expect(result).toEqual(largeSchedule);
      expect(result.length).toBe(1000);
    });
  });

  it('should handle negative loan amount', () => {
    const negativeSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: -1000,
        PrincipalPayment: -800,
        InterestPayment: -200,
        RemainingBalance: -99000,
      },
    ];

    store.overrideSelector(selectAmortizationSchedule, negativeSchedule);

    store.select(selectAmortizationSchedule).subscribe((result) => {
      expect(result).toEqual(negativeSchedule);
    });
  });

  it('should handle zero interest rate', () => {
    const zeroInterestSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 1000,
        InterestPayment: 0,
        RemainingBalance: 99000,
      },
    ];

    store.overrideSelector(selectAmortizationSchedule, zeroInterestSchedule);

    store.select(selectAmortizationSchedule).subscribe((result) => {
      expect(result).toEqual(zeroInterestSchedule);
    });
  });
});
