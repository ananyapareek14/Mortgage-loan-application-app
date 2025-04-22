import { IInterestRate } from '../../models/IInterestRate';
import * as InterestRateActions from './interest-rate.actions';

describe('Interest Rate Actions', () => {
  // Test for loadInterestRates action
  describe('loadInterestRates', () => {
    it('should create an action', () => {
      const action = InterestRateActions.loadInterestRates();
      expect(action.type).toBe('[Interest Rate] Load Interest Rates');
    });
  });

  // Tests for loadInterestRatesSuccess action
  describe('loadInterestRatesSuccess', () => {
    it('should create an action with empty array', () => {
      const interestRates: IInterestRate[] = [];
      const action = InterestRateActions.loadInterestRatesSuccess({
        interestRates,
      });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
      expect(action.interestRates).toEqual([]);
    });

    it('should create an action with multiple interest rates', () => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
        { Id: '2', Rate: 6.0, ValidFrom: '2023-02-01' },
      ];
      const action = InterestRateActions.loadInterestRatesSuccess({
        interestRates,
      });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
      expect(action.interestRates).toEqual(interestRates);
    });

    it('should create an action with a single interest rate', () => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
      ];
      const action = InterestRateActions.loadInterestRatesSuccess({
        interestRates,
      });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
      expect(action.interestRates.length).toBe(1);
      expect(action.interestRates[0]).toEqual({
        Id: '1',
        Rate: 5.5,
        ValidFrom: '2023-01-01',
      });
    });

    it('should handle interest rates with extreme values', () => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: Number.MAX_VALUE, ValidFrom: '2023-01-01' },
        { Id: '2', Rate: Number.MIN_VALUE, ValidFrom: '2023-02-01' },
      ];
      const action = InterestRateActions.loadInterestRatesSuccess({
        interestRates,
      });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
      expect(action.interestRates).toEqual(interestRates);
    });

    it('should handle interest rates with negative values', () => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: -5.5, ValidFrom: '2023-01-01' },
        { Id: '2', Rate: -0.1, ValidFrom: '2023-02-01' },
      ];
      const action = InterestRateActions.loadInterestRatesSuccess({
        interestRates,
      });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
      expect(action.interestRates).toEqual(interestRates);
    });

    it('should handle interest rates with different date formats', () => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
        { Id: '2', Rate: 6.0, ValidFrom: '2023-01-01T00:00:00Z' },
        { Id: '3', Rate: 6.5, ValidFrom: '01/01/2023' },
      ];
      const action = InterestRateActions.loadInterestRatesSuccess({
        interestRates,
      });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
      expect(action.interestRates).toEqual(interestRates);
    });
  });

  // Tests for loadInterestRatesFailure action
  describe('loadInterestRatesFailure', () => {
    it('should create an action with an error message', () => {
      const error = 'An error occurred';
      const action = InterestRateActions.loadInterestRatesFailure({ error });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Failure');
      expect(action.error).toBe(error);
    });

    it('should handle an empty error message', () => {
      const error = '';
      const action = InterestRateActions.loadInterestRatesFailure({ error });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Failure');
      expect(action.error).toBe('');
    });

    it('should handle a very long error message', () => {
      const error = 'a'.repeat(1000);
      const action = InterestRateActions.loadInterestRatesFailure({ error });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Failure');
      expect(action.error).toBe(error);
      expect(action.error.length).toBe(1000);
    });

    it('should handle error message with special characters', () => {
      const error = 'Error: $%^&*()!@#';
      const action = InterestRateActions.loadInterestRatesFailure({ error });
      expect(action.type).toBe('[Interest Rate] Load Interest Rates Failure');
      expect(action.error).toBe(error);
    });
  });
});
