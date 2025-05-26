import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { VaMortgageEffects } from './va-mortgage.effects';
import { CalculatorService } from '../../../services/calculator/calculators.service';
import {
  calculateVaMortgage,
  calculateVaMortgageSuccess,
  calculateVaMortgageFailure,
} from './va-mortgage.actions';
import { IVaMortgageRequest, IVaMortgage } from '../../../models/IVaMortgage';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

describe('VaMortgageEffects', () => {
  let actions$: Observable<any>;
  let effects: VaMortgageEffects;
  let calculatorService: jasmine.SpyObj<CalculatorService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    calculatorService = jasmine.createSpyObj('CalculatorService', [
      'calculateVaMortgage',
    ]);

    TestBed.configureTestingModule({
      providers: [
        VaMortgageEffects,
        provideMockActions(() => actions$),
        { provide: CalculatorService, useValue: calculatorService },
      ],
    });

    effects = TestBed.inject(VaMortgageEffects);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should calculate VA mortgage successfully', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IVaMortgageRequest = {
        HomePrice: 200000,
        DownPayment: 20000,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };
      const result: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 898.09,
          PrincipalPayment: 315.09,
          InterestPayment: 583.0,
          RemainingBalance: 179684.91,
        },
      ];

      actions$ = hot('-a', { a: calculateVaMortgage({ request }) });
      const response = cold('-b|', { b: result });
      calculatorService.calculateVaMortgage.and.returnValue(response);

      const expected = hot('--c', {
        c: calculateVaMortgageSuccess({ result }),
      });

      expectObservable(effects.calculateVaMortgage$).toEqual(expected);
    });
  });

  it('should handle VA mortgage calculation failure', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IVaMortgageRequest = {
        HomePrice: 200000,
        DownPayment: 20000,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };
      const error = new Error('Calculation failed');

      actions$ = hot('-a', { a: calculateVaMortgage({ request }) });
        const response: ColdObservable<IVaMortgage[]> = cold('-#|', {}, error);
      calculatorService.calculateVaMortgage.and.returnValue(response);

      const expected = hot('--c', {
        c: calculateVaMortgageFailure({ error: 'Calculation failed' }),
      });

      expectObservable(effects.calculateVaMortgage$).toEqual(expected);
    });
  });

  it('should handle edge case with zero down payment', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IVaMortgageRequest = {
        HomePrice: 200000,
        DownPayment: 0,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };
      const result: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 898.09,
          PrincipalPayment: 315.09,
          InterestPayment: 583.0,
          RemainingBalance: 199684.91,
        },
      ];

      actions$ = hot('-a', { a: calculateVaMortgage({ request }) });
      const response = cold('-b|', { b: result });
      calculatorService.calculateVaMortgage.and.returnValue(response);

      const expected = hot('--c', {
        c: calculateVaMortgageSuccess({ result }),
      });

      expectObservable(effects.calculateVaMortgage$).toEqual(expected);
    });
  });

  it('should handle edge case with very high interest rate', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IVaMortgageRequest = {
        HomePrice: 200000,
        DownPayment: 20000,
        InterestRate: 99.99,
        LoanTermYears: 30,
      };
      const result: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 15000.0,
          PrincipalPayment: 1.0,
          InterestPayment: 14999.0,
          RemainingBalance: 179999.0,
        },
      ];

      actions$ = hot('-a', { a: calculateVaMortgage({ request }) });
      const response = cold('-b|', { b: result });
      calculatorService.calculateVaMortgage.and.returnValue(response);

      const expected = hot('--c', {
        c: calculateVaMortgageSuccess({ result }),
      });

      expectObservable(effects.calculateVaMortgage$).toEqual(expected);
    });
  });

  it('should handle edge case with very short loan term', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request: IVaMortgageRequest = {
        HomePrice: 200000,
        DownPayment: 20000,
        InterestRate: 3.5,
        LoanTermYears: 1,
      };
      const result: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 15166.67,
          PrincipalPayment: 14875.0,
          InterestPayment: 291.67,
          RemainingBalance: 165125.0,
        },
      ];

      actions$ = hot('-a', { a: calculateVaMortgage({ request }) });
      const response = cold('-b|', { b: result });
      calculatorService.calculateVaMortgage.and.returnValue(response);

      const expected = hot('--c', {
        c: calculateVaMortgageSuccess({ result }),
      });

      expectObservable(effects.calculateVaMortgage$).toEqual(expected);
    });
  });

  it('should handle multiple concurrent requests', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const request1: IVaMortgageRequest = {
        HomePrice: 200000,
        DownPayment: 20000,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };
      const request2: IVaMortgageRequest = {
        HomePrice: 300000,
        DownPayment: 60000,
        InterestRate: 2.75,
        LoanTermYears: 15,
      };
      const result1: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 898.09,
          PrincipalPayment: 315.09,
          InterestPayment: 583.0,
          RemainingBalance: 179684.91,
        },
      ];
      const result2: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 1632.96,
          PrincipalPayment: 1082.96,
          InterestPayment: 550.0,
          RemainingBalance: 238917.04,
        },
      ];

      actions$ = hot('-a-b', {
        a: calculateVaMortgage({ request: request1 }),
        b: calculateVaMortgage({ request: request2 }),
      });
      const response1 = cold('-r|', { r: result1 });
      const response2 = cold('--s|', { s: result2 });
      calculatorService.calculateVaMortgage.and.returnValues(
        response1,
        response2
      );

      const expected = hot('--c--d', {
        c: calculateVaMortgageSuccess({ result: result1 }),
        d: calculateVaMortgageSuccess({ result: result2 }),
      });

      expectObservable(effects.calculateVaMortgage$).toEqual(expected);
    });
  });
});
