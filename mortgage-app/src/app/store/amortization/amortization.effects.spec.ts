import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { AmortizationEffects } from './amortization.effects';
import { AmortizationService } from '../../services/amortization/amortization.service';
import {
  loadAmortizationSchedule,
  loadAmortizationScheduleSuccess,
  loadAmortizationScheduleFailure,
  calculateAmortization,
  calculateAmortizationSuccess,
  calculateAmortizationFailure,
} from './amortization.actions';
import { cold, hot } from 'jasmine-marbles';
import { IAmortizationSchedule, IAmortizationRequest } from '../../models/IAmortizationSchedule';

describe('AmortizationEffects', () => {
  let actions$: Observable<Action>;
  let effects: AmortizationEffects;
  let amortizationService: jasmine.SpyObj<AmortizationService>;

  beforeEach(() => {
    const mockAmortizationService = jasmine.createSpyObj(
      'AmortizationService',
      ['getAmortizationByLoanId', 'calculateAmortization']
    );

    TestBed.configureTestingModule({
      providers: [
        AmortizationEffects,
        provideMockActions(() => actions$),
        { provide: AmortizationService, useValue: mockAmortizationService },
      ],
    });

    effects = TestBed.inject(AmortizationEffects);
    amortizationService = TestBed.inject(
      AmortizationService
    ) as jasmine.SpyObj<AmortizationService>;
  });

  describe('loadAmortization$', () => {
    it('should return loadAmortizationScheduleSuccess with schedule on successful API call', () => {
      const userLoanNumber = 12345;
      const mockSchedule: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-05-01'),
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 99000,
        },
      ];
      const action = loadAmortizationSchedule({ userLoanNumber });
      const outcome = loadAmortizationScheduleSuccess({
        schedule: mockSchedule,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: mockSchedule });
      amortizationService.getAmortizationByLoanId.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.loadAmortization$).toBeObservable(expected);
    });

    it('should return loadAmortizationScheduleFailure on API error', () => {
      const userLoanNumber = 12345;
      const error = new Error('API Error');
      const action = loadAmortizationSchedule({ userLoanNumber });
      const outcome = loadAmortizationScheduleFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      amortizationService.getAmortizationByLoanId.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.loadAmortization$).toBeObservable(expected);
    });

    it('should handle empty loan number', () => {
      const userLoanNumber = NaN;
      const action = loadAmortizationSchedule({ userLoanNumber });
      const outcome = loadAmortizationScheduleFailure({
        error: 'Invalid loan number',
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, new Error('Invalid loan number'));
      amortizationService.getAmortizationByLoanId.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.loadAmortization$).toBeObservable(expected);
    });
  });

  describe('calculateAmortization$', () => {
    it('should return calculateAmortizationSuccess with schedule on successful calculation', () => {
      const request: IAmortizationRequest = {
        LoanAmount: 100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };
      const mockSchedule: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-05-01'),
          MonthlyPayment: 536.82,
          PrincipalPayment: 120.15,
          InterestPayment: 416.67,
          RemainingBalance: 99879.85,
        },
      ];
      const action = calculateAmortization({ request });
      const outcome = calculateAmortizationSuccess({ schedule: mockSchedule });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: mockSchedule });
      amortizationService.calculateAmortization.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.calculateAmortization$).toBeObservable(expected);
    });

    it('should return calculateAmortizationFailure on calculation error', () => {
      const request: IAmortizationRequest = {
        LoanAmount: -100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };
      const error = new Error('Invalid loan amount');
      const action = calculateAmortization({ request });
      const outcome = calculateAmortizationFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      amortizationService.calculateAmortization.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.calculateAmortization$).toBeObservable(expected);
    });

    it('should handle edge case with very large numbers', () => {
      const request: IAmortizationRequest = {
        LoanAmount: Number.MAX_SAFE_INTEGER,
        InterestRate: 100,
        LoanTermYears: 1000,
      };
      const mockSchedule: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-05-01'),
          MonthlyPayment: Number.MAX_SAFE_INTEGER,
          PrincipalPayment: 0,
          InterestPayment: Number.MAX_SAFE_INTEGER,
          RemainingBalance: Number.MAX_SAFE_INTEGER,
        },
      ];
      const action = calculateAmortization({ request });
      const outcome = calculateAmortizationSuccess({ schedule: mockSchedule });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: mockSchedule });
      amortizationService.calculateAmortization.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.calculateAmortization$).toBeObservable(expected);
    });

    it('should handle boundary condition with zero values', () => {
      const request: IAmortizationRequest = {
        LoanAmount: 0,
        InterestRate: 0,
        LoanTermYears: 0,
      };
      const error = new Error('Invalid input parameters');
      const action = calculateAmortization({ request });
      const outcome = calculateAmortizationFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      amortizationService.calculateAmortization.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.calculateAmortization$).toBeObservable(expected);
    });

    it('should handle edge case with very short loan term', () => {
      const request: IAmortizationRequest = {
        LoanAmount: 10000,
        InterestRate: 5,
        LoanTermYears: 1 / 12,
      }; // 1 month
      const mockSchedule: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-05-01'),
          MonthlyPayment: 10041.67,
          PrincipalPayment: 10000,
          InterestPayment: 41.67,
          RemainingBalance: 0,
        },
      ];
      const action = calculateAmortization({ request });
      const outcome = calculateAmortizationSuccess({ schedule: mockSchedule });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: mockSchedule });
      amortizationService.calculateAmortization.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects.calculateAmortization$).toBeObservable(expected);
    });
  });
});
