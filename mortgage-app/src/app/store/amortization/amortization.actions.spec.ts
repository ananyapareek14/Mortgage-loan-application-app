import { createAction, props } from '@ngrx/store';
import {
  IAmortizationRequest,
  IAmortizationSchedule,
} from '../../models/IAmortizationSchedule';
import * as AmortizationActions from './amortization.actions';

describe('Amortization Actions', () => {
  // Test for loadAmortizationSchedule action
  describe('loadAmortizationSchedule', () => {
    it('should create an action with the correct type and payload', () => {
      const userLoanNumber = 12345;
      const action = AmortizationActions.loadAmortizationSchedule({
        userLoanNumber,
      });
      expect(action.type).toBe('[Amortization] Load Amortization Schedule');
      expect(action.userLoanNumber).toBe(userLoanNumber);
    });

    it('should handle edge case with zero loan number', () => {
      const userLoanNumber = 0;
      const action = AmortizationActions.loadAmortizationSchedule({
        userLoanNumber,
      });
      expect(action.type).toBe('[Amortization] Load Amortization Schedule');
      expect(action.userLoanNumber).toBe(userLoanNumber);
    });
  });

  // Test for loadAmortizationScheduleSuccess action
  describe('loadAmortizationScheduleSuccess', () => {
    it('should create an action with the correct type and payload', () => {
      const schedule: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-05-01'),
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 99000,
        },
        {
          PaymentNumber: 2,
          PaymentDate: new Date('2023-06-01'),
          MonthlyPayment: 1000,
          PrincipalPayment: 810,
          InterestPayment: 190,
          RemainingBalance: 98190,
        },
      ];
      const action = AmortizationActions.loadAmortizationScheduleSuccess({
        schedule,
      });
      expect(action.type).toBe(
        '[Amortization] Load Amortization Schedule Success'
      );
      expect(action.schedule).toEqual(schedule);
    });

    it('should handle an empty schedule array', () => {
      const schedule: IAmortizationSchedule[] = [];
      const action = AmortizationActions.loadAmortizationScheduleSuccess({
        schedule,
      });
      expect(action.type).toBe(
        '[Amortization] Load Amortization Schedule Success'
      );
      expect(action.schedule).toEqual([]);
    });
  });

  // Test for loadAmortizationScheduleFailure action
  describe('loadAmortizationScheduleFailure', () => {
    it('should create an action with the correct type and error message', () => {
      const error = 'Failed to load amortization schedule';
      const action = AmortizationActions.loadAmortizationScheduleFailure({
        error,
      });
      expect(action.type).toBe(
        '[Amortization] Load Amortization Schedule Failure'
      );
      expect(action.error).toBe(error);
    });

    it('should handle an empty error message', () => {
      const error = '';
      const action = AmortizationActions.loadAmortizationScheduleFailure({
        error,
      });
      expect(action.type).toBe(
        '[Amortization] Load Amortization Schedule Failure'
      );
      expect(action.error).toBe('');
    });
  });

  // Test for calculateAmortization action
  describe('calculateAmortization', () => {
    it('should create an action with the correct type and payload', () => {
      const request: IAmortizationRequest = {
        LoanAmount: 100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };
      const action = AmortizationActions.calculateAmortization({ request });
      expect(action.type).toBe('[Amortization] Calculate Amortization');
      expect(action.request).toEqual(request);
    });

    it('should handle edge case with minimum values', () => {
      const request: IAmortizationRequest = {
        LoanAmount: 1,
        InterestRate: 0.01,
        LoanTermYears: 1,
      };
      const action = AmortizationActions.calculateAmortization({ request });
      expect(action.type).toBe('[Amortization] Calculate Amortization');
      expect(action.request).toEqual(request);
    });

    it('should handle edge case with maximum values', () => {
      const request: IAmortizationRequest = {
        LoanAmount: Number.MAX_SAFE_INTEGER,
        InterestRate: 100,
        LoanTermYears: 100,
      };
      const action = AmortizationActions.calculateAmortization({ request });
      expect(action.type).toBe('[Amortization] Calculate Amortization');
      expect(action.request).toEqual(request);
    });
  });

  // Test for calculateAmortizationSuccess action
  describe('calculateAmortizationSuccess', () => {
    it('should create an action with the correct type and payload', () => {
      const schedule: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-05-01'),
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 99000,
        },
        {
          PaymentNumber: 2,
          PaymentDate: new Date('2023-06-01'),
          MonthlyPayment: 1000,
          PrincipalPayment: 810,
          InterestPayment: 190,
          RemainingBalance: 98190,
        },
      ];
      const action = AmortizationActions.calculateAmortizationSuccess({
        schedule,
      });
      expect(action.type).toBe('[Amortization] Calculate Amortization Success');
      expect(action.schedule).toEqual(schedule);
    });

    it('should handle a large schedule array', () => {
      const schedule: IAmortizationSchedule[] = Array(360).fill({
        PaymentNumber: 1,
        PaymentDate: new Date('2023-05-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      });
      const action = AmortizationActions.calculateAmortizationSuccess({
        schedule,
      });
      expect(action.type).toBe('[Amortization] Calculate Amortization Success');
      expect(action.schedule.length).toBe(360);
    });
  });

  // Test for calculateAmortizationFailure action
  describe('calculateAmortizationFailure', () => {
    it('should create an action with the correct type and error message', () => {
      const error = 'Failed to calculate amortization';
      const action = AmortizationActions.calculateAmortizationFailure({
        error,
      });
      expect(action.type).toBe('[Amortization] Calculate Amortization Failure');
      expect(action.error).toBe(error);
    });

    it('should handle a long error message', () => {
      const error = 'A'.repeat(1000);
      const action = AmortizationActions.calculateAmortizationFailure({
        error,
      });
      expect(action.type).toBe('[Amortization] Calculate Amortization Failure');
      expect(action.error?.length).toBe(1000);
    });
  });

  // Test for resetAmortization action
  describe('resetAmortization', () => {
    it('should create an action with the correct type', () => {
      const action = AmortizationActions.resetAmortization();
      expect(action.type).toBe('[Amortization] Reset');
    });
  });
});
