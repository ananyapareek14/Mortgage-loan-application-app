import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RefinanceEffects } from './refinance.effects';
import { CalculatorService } from '../../../services/calculator/calculators.service';
import {
  calculateRefinance,
  calculateRefinanceSuccess,
  calculateRefinanceFailure,
} from './refinance.actions';
import { IRefinance, IRefinanceRequest } from '../../../models/IRefinance';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

describe('RefinanceEffects', () => {
  let actions$: Observable<any>;
  let effects: RefinanceEffects;
  let calculatorService: jasmine.SpyObj<CalculatorService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    calculatorService = jasmine.createSpyObj('CalculatorService', [
      'calculateRefinance',
    ]);

    TestBed.configureTestingModule({
      providers: [
        RefinanceEffects,
        provideMockActions(() => actions$),
        { provide: CalculatorService, useValue: calculatorService },
      ],
    });

    effects = TestBed.inject(RefinanceEffects);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should handle successful refinance calculation', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const refinanceRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 4.5,
        CurrentTermMonths: 360,
        OriginationYear: 2015,
        NewLoanAmount: 180000,
        NewInterestRate: 3.5,
        NewTermMonths: 300,
        RefinanceFees: 3000,
      };
      const refinanceResult: IRefinance = {
        MonthlySavings: 250,
        NewPayment: 1000,
        BreakEvenMonths: 12,
        LifetimeSavings: 50000,
      };

      actions$ = hot('-a', {
        a: calculateRefinance({ request: refinanceRequest }),
      });
      const response$ = cold('-b|', { b: refinanceResult });
      calculatorService.calculateRefinance.and.returnValue(response$);

      const expected$ = hot('--c', {
        c: calculateRefinanceSuccess({ result: refinanceResult }),
      });

      expectObservable(effects.calculateRefinance$).toEqual(expected$);
    });
  });

  it('should handle refinance calculation failure', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const refinanceRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 4.5,
        CurrentTermMonths: 360,
        OriginationYear: 2015,
        NewLoanAmount: 180000,
        NewInterestRate: 3.5,
        NewTermMonths: 300,
        RefinanceFees: 3000,
      };
      const error = new Error('API Error');

      actions$ = hot('-a', {
        a: calculateRefinance({ request: refinanceRequest }),
      });
        //   const response$ = cold('-#|', {}, error);
        const response$: ColdObservable<IRefinance> = cold('-#|', {}, error);
      calculatorService.calculateRefinance.and.returnValue(response$);

      const expected$ = hot('--c', {
        c: calculateRefinanceFailure({ error: error.message }),
      });

      expectObservable(effects.calculateRefinance$).toEqual(expected$);
    });
  });

  it('should handle edge case: very high loan amount', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const refinanceRequest: IRefinanceRequest = {
        CurrentLoanAmount: 10000000,
        InterestRate: 4.5,
        CurrentTermMonths: 360,
        OriginationYear: 2015,
        NewLoanAmount: 9500000,
        NewInterestRate: 3.5,
        NewTermMonths: 300,
        RefinanceFees: 50000,
      };
      const refinanceResult: IRefinance = {
        MonthlySavings: 5000,
        NewPayment: 50000,
        BreakEvenMonths: 10,
        LifetimeSavings: 1000000,
      };

      actions$ = hot('-a', {
        a: calculateRefinance({ request: refinanceRequest }),
      });
      const response$ = cold('-b|', { b: refinanceResult });
      calculatorService.calculateRefinance.and.returnValue(response$);

      const expected$ = hot('--c', {
        c: calculateRefinanceSuccess({ result: refinanceResult }),
      });

      expectObservable(effects.calculateRefinance$).toEqual(expected$);
    });
  });

  it('should handle edge case: very low loan amount', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const refinanceRequest: IRefinanceRequest = {
        CurrentLoanAmount: 10000,
        InterestRate: 4.5,
        CurrentTermMonths: 120,
        OriginationYear: 2020,
        NewLoanAmount: 9000,
        NewInterestRate: 3.5,
        NewTermMonths: 60,
        RefinanceFees: 500,
      };
      const refinanceResult: IRefinance = {
        MonthlySavings: 10,
        NewPayment: 200,
        BreakEvenMonths: 50,
        LifetimeSavings: 500,
      };

      actions$ = hot('-a', {
        a: calculateRefinance({ request: refinanceRequest }),
      });
      const response$ = cold('-b|', { b: refinanceResult });
      calculatorService.calculateRefinance.and.returnValue(response$);

      const expected$ = hot('--c', {
        c: calculateRefinanceSuccess({ result: refinanceResult }),
      });

      expectObservable(effects.calculateRefinance$).toEqual(expected$);
    });
  });

  it('should handle edge case: same interest rate', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const refinanceRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 4.5,
        CurrentTermMonths: 360,
        OriginationYear: 2015,
        NewLoanAmount: 190000,
        NewInterestRate: 4.5,
        NewTermMonths: 300,
        RefinanceFees: 3000,
      };
      const refinanceResult: IRefinance = {
        MonthlySavings: 0,
        NewPayment: 1013.37,
        BreakEvenMonths: Infinity,
        LifetimeSavings: -3000,
      };

      actions$ = hot('-a', {
        a: calculateRefinance({ request: refinanceRequest }),
      });
      const response$ = cold('-b|', { b: refinanceResult });
      calculatorService.calculateRefinance.and.returnValue(response$);

      const expected$ = hot('--c', {
        c: calculateRefinanceSuccess({ result: refinanceResult }),
      });

      expectObservable(effects.calculateRefinance$).toEqual(expected$);
    });
  });

  it('should handle network timeout error', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const refinanceRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 4.5,
        CurrentTermMonths: 360,
        OriginationYear: 2015,
        NewLoanAmount: 180000,
        NewInterestRate: 3.5,
        NewTermMonths: 300,
        RefinanceFees: 3000,
      };
      const error = new Error('Network timeout');

      actions$ = hot('-a', {
        a: calculateRefinance({ request: refinanceRequest }),
      });
        //   const response$ = cold('-#|', {}, error);
        const response$: ColdObservable<IRefinance> = cold('-#|', {}, error);
      calculatorService.calculateRefinance.and.returnValue(response$);

      const expected$ = hot('--c', {
        c: calculateRefinanceFailure({ error: error.message }),
      });

      expectObservable(effects.calculateRefinance$).toEqual(expected$);
    });
  });
});
