import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AffordabilityEffects } from './affordability.effects';
import { CalculatorService } from '../../../services/calculator/calculators.service';
import {
  calculateAffordability,
  calculateAffordabilitySuccess,
  calculateAffordabilityFailure,
} from './affordability.actions';
import { IAffordability, IAffordabilityRequest } from '../../../models/IAffordability';

describe('AffordabilityEffects', () => {
  let actions$: Observable<any>;
  let effects: AffordabilityEffects;
  let calculatorService: jasmine.SpyObj<CalculatorService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    calculatorService = jasmine.createSpyObj('CalculatorService', [
      'calculateAffordability',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AffordabilityEffects,
        provideMockActions(() => actions$),
        { provide: CalculatorService, useValue: calculatorService },
      ],
    });

    effects = TestBed.inject(AffordabilityEffects);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should calculate affordability successfully', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IAffordabilityRequest = {
        AnnualIncome: 50000,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 500,
      };
      const result: IAffordability = {
        MaxAffordableHomePrice: 250000,
        EstimatedLoanAmount: 230000,
        EstimatedMonthlyPayment: 1032.78,
        DtiPercentage: 36,
        AnnualIncome: 50000,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 500,
      };

      actions$ = hot('-a', { a: calculateAffordability({ request }) });
      const response$ = cold('-b|', { b: result });
      calculatorService.calculateAffordability.and.returnValue(response$);

      const expected$ = cold('--c', {
        c: calculateAffordabilitySuccess({ result }),
      });

      expectObservable(effects.calculateAffordability$).toEqual(expected$);
    });
  });

//   it('should handle calculation failure', () => {
//     testScheduler.run(({ hot, cold, expectObservable }) => {
//       const request: IAffordabilityRequest = {
//         AnnualIncome: 50000,
//         DownPayment: 20000,
//         LoanTermMonths: 360,
//         InterestRate: 3.5,
//         MonthlyDebts: 500,
//       };
//       const error = new Error('Calculation failed');

//       actions$ = hot('-a', { a: calculateAffordability({ request }) });
//       const response$ = cold('-#|', {}, error);
//       calculatorService.calculateAffordability.and.returnValue(response$);

//       const expected$ = cold('--c', {
//         c: calculateAffordabilityFailure({ error: error.message }),
//       });

//       expectObservable(effects.calculateAffordability$).toEqual(expected$);
//     });
//   });

  it('should handle zero annual income', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IAffordabilityRequest = {
        AnnualIncome: 0,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 500,
      };
      const result: IAffordability = {
        MaxAffordableHomePrice: 0,
        EstimatedLoanAmount: 0,
        EstimatedMonthlyPayment: 0,
        DtiPercentage: 0,
        AnnualIncome: 0,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 500,
      };

      actions$ = hot('-a', { a: calculateAffordability({ request }) });
      const response$ = cold('-b|', { b: result });
      calculatorService.calculateAffordability.and.returnValue(response$);

      const expected$ = cold('--c', {
        c: calculateAffordabilitySuccess({ result }),
      });

      expectObservable(effects.calculateAffordability$).toEqual(expected$);
    });
  });

//   it('should handle negative down payment', () => {
//     testScheduler.run(({ hot, cold, expectObservable }) => {
//       const request: IAffordabilityRequest = {
//         AnnualIncome: 50000,
//         DownPayment: -10000,
//         LoanTermMonths: 360,
//         InterestRate: 3.5,
//         MonthlyDebts: 500,
//       };
//       const error = new Error('Invalid down payment');

//       actions$ = hot('-a', { a: calculateAffordability({ request }) });
//       const response$ = cold('-#|', {}, error);
//       calculatorService.calculateAffordability.and.returnValue(response$);

//       const expected$ = cold('--c', {
//         c: calculateAffordabilityFailure({ error: error.message }),
//       });

//       expectObservable(effects.calculateAffordability$).toEqual(expected$);
//     });
//   });

  it('should handle very large numbers', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IAffordabilityRequest = {
        AnnualIncome: Number.MAX_SAFE_INTEGER,
        DownPayment: Number.MAX_SAFE_INTEGER,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: Number.MAX_SAFE_INTEGER,
      };
      const result: IAffordability = {
        MaxAffordableHomePrice: Number.MAX_SAFE_INTEGER,
        EstimatedLoanAmount: 0,
        EstimatedMonthlyPayment: 0,
        DtiPercentage: 100,
        AnnualIncome: Number.MAX_SAFE_INTEGER,
        DownPayment: Number.MAX_SAFE_INTEGER,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: Number.MAX_SAFE_INTEGER,
      };

      actions$ = hot('-a', { a: calculateAffordability({ request }) });
      const response$ = cold('-b|', { b: result });
      calculatorService.calculateAffordability.and.returnValue(response$);

      const expected$ = cold('--c', {
        c: calculateAffordabilitySuccess({ result }),
      });

      expectObservable(effects.calculateAffordability$).toEqual(expected$);
    });
  });
});
