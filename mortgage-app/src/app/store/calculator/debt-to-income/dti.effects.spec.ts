import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { DtiEffects } from './dti.effects';
import * as DtiActions from './dti.actions';
import { CalculatorService } from '../../../services/calculator/calculators.service';
import { IDebtToIncome, IDebtToIncomeRequest } from '../../../models/IDebt-To-Income';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';


describe('DtiEffects', () => {
  let effects: DtiEffects;
  let actions$: Observable<any>;
  let calculatorService: jasmine.SpyObj<CalculatorService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    calculatorService = jasmine.createSpyObj('CalculatorService', [
      'calculateDti',
    ]);

    TestBed.configureTestingModule({
      providers: [
        DtiEffects,
        provideMockActions(() => actions$),
        { provide: CalculatorService, useValue: calculatorService },
      ],
    });

    effects = TestBed.inject(DtiEffects);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should calculate DTI successfully', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IDebtToIncomeRequest = {
        AnnualIncome: 60000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: false,
      };
      const result: IDebtToIncome = {
        DtiPercentage: 35,
        TotalDebts: 1750,
        ProposedMonthlyPayment: 1000,
        RemainingMonthlyIncome: 3250,
      };
      const action = DtiActions.calculateDti({ request });
      const completion = DtiActions.calculateDtiSuccess({ result });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      calculatorService.calculateDti.and.returnValue(response);

      expectObservable(effects.calculateDti$()).toBe('--c', { c: completion });
    });
  });

  // it('should handle DTI calculation failure', () => {
  //   testScheduler.run(({ hot, cold, expectObservable }) => {
  //     const request: IDebtToIncomeRequest = {
  //       AnnualIncome: 60000,
  //       MinCreditCardPayments: 200,
  //       CarLoanPayments: 300,
  //       StudentLoanPayments: 250,
  //       ProposedMonthlyPayment: 1000,
  //       CalculateDefaultPayment: false,
  //     };
  //     const error = new Error('Calculation failed');
  //     const action = DtiActions.calculateDti({ request });
  //     const completion = DtiActions.calculateDtiFailure({ error });

  //     actions$ = hot('-a', { a: action });
  //       //   const response = cold('-#|', {}, error);
  //       const mockDti: IDebtToIncome = {
  //         DtiPercentage: 30,
  //         TotalDebts: 1500,
  //         ProposedMonthlyPayment: 1000,
  //         RemainingMonthlyIncome: 2500,
  //       };
          

  //       const response = cold('---x|', { x: mockDti });
          
  //     calculatorService.calculateDti.and.returnValue(response);

  //     expectObservable(effects.calculateDti$()).toBe('----c', { c: completion });
  //   });
  // });

  it('should handle DTI calculation failure', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IDebtToIncomeRequest = {
        AnnualIncome: 60000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: false,
      };

      const error = new Error('Calculation failed');
      const action = DtiActions.calculateDti({ request });
      const completion = DtiActions.calculateDtiFailure({ error });

      actions$ = hot('-a', { a: action });

      // Simulate error response
      // const response = cold('---#', {}, error);
      const response: ColdObservable<IDebtToIncome> = cold('---#', {}, error);
      calculatorService.calculateDti.and.returnValue(response);

      // Expected to emit failure action after 3 frames of async work
      expectObservable(effects.calculateDti$()).toBe('----c', { c: completion });
    });
  });
  

  it('should handle edge case with zero annual income', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IDebtToIncomeRequest = {
        AnnualIncome: 0,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: false,
      };
      const result: IDebtToIncome = {
        DtiPercentage: Infinity,
        TotalDebts: 1750,
        ProposedMonthlyPayment: 1000,
        RemainingMonthlyIncome: -1750,
      };
      const action = DtiActions.calculateDti({ request });
      const completion = DtiActions.calculateDtiSuccess({ result });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      calculatorService.calculateDti.and.returnValue(response);

      expectObservable(effects.calculateDti$()).toBe('--c', { c: completion });
    });
  });

  it('should handle edge case with very high annual income', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IDebtToIncomeRequest = {
        AnnualIncome: Number.MAX_SAFE_INTEGER,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: false,
      };
      const result: IDebtToIncome = {
        DtiPercentage: 0,
        TotalDebts: 1750,
        ProposedMonthlyPayment: 1000,
        RemainingMonthlyIncome: Number.MAX_SAFE_INTEGER / 12 - 1750,
      };
      const action = DtiActions.calculateDti({ request });
      const completion = DtiActions.calculateDtiSuccess({ result });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      calculatorService.calculateDti.and.returnValue(response);

      expectObservable(effects.calculateDti$()).toBe('--c', { c: completion });
    });
  });

  it('should handle edge case with CalculateDefaultPayment set to true', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IDebtToIncomeRequest = {
        AnnualIncome: 60000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 0,
        CalculateDefaultPayment: true,
      };
      const result: IDebtToIncome = {
        DtiPercentage: 15,
        TotalDebts: 750,
        ProposedMonthlyPayment: 750,
        RemainingMonthlyIncome: 4250,
      };
      const action = DtiActions.calculateDti({ request });
      const completion = DtiActions.calculateDtiSuccess({ result });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: result });
      calculatorService.calculateDti.and.returnValue(response);

      expectObservable(effects.calculateDti$()).toBe('--c', { c: completion });
    });
  });

  it('should handle multiple concurrent requests', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request1: IDebtToIncomeRequest = {
        AnnualIncome: 60000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: false,
      };
      const request2: IDebtToIncomeRequest = {
        AnnualIncome: 72000,
        MinCreditCardPayments: 250,
        CarLoanPayments: 350,
        StudentLoanPayments: 300,
        ProposedMonthlyPayment: 1200,
        CalculateDefaultPayment: false,
      };
      const result1: IDebtToIncome = {
        DtiPercentage: 35,
        TotalDebts: 1750,
        ProposedMonthlyPayment: 1000,
        RemainingMonthlyIncome: 3250,
      };
      const result2: IDebtToIncome = {
        DtiPercentage: 35,
        TotalDebts: 2100,
        ProposedMonthlyPayment: 1200,
        RemainingMonthlyIncome: 3900,
      };
      const action1 = DtiActions.calculateDti({ request: request1 });
      const action2 = DtiActions.calculateDti({ request: request2 });
      const completion1 = DtiActions.calculateDtiSuccess({ result: result1 });
      const completion2 = DtiActions.calculateDtiSuccess({ result: result2 });

      actions$ = hot('-a-b', { a: action1, b: action2 });
      const response1 = cold('-x|', { x: result1 });
      const response2 = cold('--y|', { y: result2 });
      calculatorService.calculateDti.and.returnValues(response1, response2);

      expectObservable(effects.calculateDti$()).toBe('--c--d', {
        c: completion1,
        d: completion2,
      });
    });
  });
});
