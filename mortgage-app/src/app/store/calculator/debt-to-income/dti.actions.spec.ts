import { createAction, props } from '@ngrx/store';
import {
  IDebtToIncome,
  IDebtToIncomeRequest,
} from '../../../models/IDebt-To-Income';
import * as dtiActions from './dti.actions';

describe('DTI Actions', () => {
  // Test for calculateDti action
  it('should create calculateDti action', () => {
    const request: IDebtToIncomeRequest = {
      AnnualIncome: 50000,
      MinCreditCardPayments: 200,
      CarLoanPayments: 300,
      StudentLoanPayments: 250,
      ProposedMonthlyPayment: 1000,
      CalculateDefaultPayment: false,
    };
    const action = dtiActions.calculateDti({ request });

    expect(action.type).toBe('[DTI] Calculate');
    expect(action.request).toEqual(request);
  });

  // Test for calculateDtiSuccess action
  it('should create calculateDtiSuccess action', () => {
    const result: IDebtToIncome = {
      DtiPercentage: 40,
      TotalDebts: 1750,
      ProposedMonthlyPayment: 1000,
      RemainingMonthlyIncome: 1416.67,
    };
    const action = dtiActions.calculateDtiSuccess({ result });

    expect(action.type).toBe('[DTI] Calculate Success');
    expect(action.result).toEqual(result);
  });

  // Test for calculateDtiFailure action
  it('should create calculateDtiFailure action', () => {
    const error = new Error('Test error');
    const action = dtiActions.calculateDtiFailure({ error });

    expect(action.type).toBe('[DTI] Calculate Failure');
    expect(action.error).toEqual(error);
  });

  // Test for resetDti action
  it('should create resetDti action', () => {
    const action = dtiActions.resetDti();

    expect(action.type).toBe('[DTI] Reset');
  });

  // Edge case: Minimum values for calculateDti
  it('should handle minimum values for calculateDti', () => {
    const request: IDebtToIncomeRequest = {
      AnnualIncome: 0,
      MinCreditCardPayments: 0,
      CarLoanPayments: 0,
      StudentLoanPayments: 0,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    const action = dtiActions.calculateDti({ request });

    expect(action.type).toBe('[DTI] Calculate');
    expect(action.request).toEqual(request);
  });

  // Edge case: Very large numbers for calculateDti
  it('should handle very large numbers for calculateDti', () => {
    const request: IDebtToIncomeRequest = {
      AnnualIncome: Number.MAX_SAFE_INTEGER,
      MinCreditCardPayments: Number.MAX_SAFE_INTEGER,
      CarLoanPayments: Number.MAX_SAFE_INTEGER,
      StudentLoanPayments: Number.MAX_SAFE_INTEGER,
      ProposedMonthlyPayment: Number.MAX_SAFE_INTEGER,
      CalculateDefaultPayment: false,
    };
    const action = dtiActions.calculateDti({ request });

    expect(action.type).toBe('[DTI] Calculate');
    expect(action.request).toEqual(request);
  });

  // Edge case: Negative values for calculateDti
  it('should handle negative values for calculateDti', () => {
    const request: IDebtToIncomeRequest = {
      AnnualIncome: -50000,
      MinCreditCardPayments: -200,
      CarLoanPayments: -300,
      StudentLoanPayments: -250,
      ProposedMonthlyPayment: -1000,
      CalculateDefaultPayment: false,
    };
    const action = dtiActions.calculateDti({ request });

    expect(action.type).toBe('[DTI] Calculate');
    expect(action.request).toEqual(request);
  });

  // Edge case: Decimal values for calculateDti
  it('should handle decimal values for calculateDti', () => {
    const request: IDebtToIncomeRequest = {
      AnnualIncome: 50000.5,
      MinCreditCardPayments: 200.25,
      CarLoanPayments: 300.75,
      StudentLoanPayments: 250.5,
      ProposedMonthlyPayment: 1000.99,
      CalculateDefaultPayment: true,
    };
    const action = dtiActions.calculateDti({ request });

    expect(action.type).toBe('[DTI] Calculate');
    expect(action.request).toEqual(request);
  });

  // Error handling: Null result for calculateDtiSuccess
//   it('should handle null result for calculateDtiSuccess', () => {
//     const result = null;
//     const action = dtiActions.calculateDtiSuccess({ result });

//     expect(action.type).toBe('[DTI] Calculate Success');
//     expect(action.result).toBeNull();
//   });

  // Error handling: Undefined error for calculateDtiFailure
  it('should handle undefined error for calculateDtiFailure', () => {
    const error = undefined;
    const action = dtiActions.calculateDtiFailure({ error });

    expect(action.type).toBe('[DTI] Calculate Failure');
    expect(action.error).toBeUndefined();
  });
});
