import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { InterestRateEffects } from './interest-rate.effects';
import { InterestRateService } from '../../services/interestRate/interest-rate.service';
import {
  loadInterestRates,
  loadInterestRatesSuccess,
  loadInterestRatesFailure,
} from './interest-rate.actions';
import { IInterestRate } from '../../models/IInterestRate';

describe('InterestRateEffects', () => {
  let effects: InterestRateEffects;
  let actions$: Observable<any>;
  let interestRateService: jasmine.SpyObj<InterestRateService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    const interestRateServiceSpy = jasmine.createSpyObj('InterestRateService', [
      'getInterestRate',
    ]);

    TestBed.configureTestingModule({
      providers: [
        InterestRateEffects,
        provideMockActions(() => actions$),
        { provide: InterestRateService, useValue: interestRateServiceSpy },
      ],
    });

    effects = TestBed.inject(InterestRateEffects);
    interestRateService = TestBed.inject(
      InterestRateService
    ) as jasmine.SpyObj<InterestRateService>;
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should load interest rates successfully', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 0.05, ValidFrom: '2023-01-01' },
        { Id: '2', Rate: 0.06, ValidFrom: '2023-07-01' },
      ];
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold('-b|', { b: interestRates });
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('--c', {
        c: loadInterestRatesSuccess({ interestRates }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle empty interest rates response', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates: IInterestRate[] = [];
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold('-b|', { b: interestRates });
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('--c', {
        c: loadInterestRatesSuccess({ interestRates }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle error when loading interest rates fails', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const error = new Error('Test error');
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold<IInterestRate[]>('-#', {}, error);
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('--c', {
        c: loadInterestRatesFailure({ error: error.message }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle multiple concurrent loadInterestRates actions', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates1: IInterestRate[] = [
        { Id: '1', Rate: 0.05, ValidFrom: '2023-01-01' },
      ];
      const interestRates2: IInterestRate[] = [
        { Id: '2', Rate: 0.06, ValidFrom: '2023-07-01' },
      ];
      actions$ = hot('-a-b', {
        a: loadInterestRates(),
        b: loadInterestRates(),
      });
      const response1 = cold('-x|', { x: interestRates1 });
      const response2 = cold('-y|', { y: interestRates2 });
      interestRateService.getInterestRate.and.returnValues(
        response1,
        response2
      );

      const expected = hot('--c-d', {
        c: loadInterestRatesSuccess({ interestRates: interestRates1 }),
        d: loadInterestRatesSuccess({ interestRates: interestRates2 }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle delayed response from service', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 0.05, ValidFrom: '2023-01-01' },
      ];
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold('----b|', { b: interestRates });
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('-----c', {
        c: loadInterestRatesSuccess({ interestRates }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle immediate error from service', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const error = new Error('Immediate error');
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold<IInterestRate[]>('#', {}, error);
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('-c', {
        c: loadInterestRatesFailure({ error: error.message }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  // Edge cases
  it('should handle interest rates with very high values', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 1000000, ValidFrom: '2023-01-01' },
      ];
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold('-b|', { b: interestRates });
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('--c', {
        c: loadInterestRatesSuccess({ interestRates }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle interest rates with very low values', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 0.0000001, ValidFrom: '2023-01-01' },
      ];
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold('-b|', { b: interestRates });
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('--c', {
        c: loadInterestRatesSuccess({ interestRates }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });

  it('should handle interest rates with invalid dates', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const interestRates: IInterestRate[] = [
        { Id: '1', Rate: 0.05, ValidFrom: 'invalid-date' },
      ];
      actions$ = hot('-a', { a: loadInterestRates() });
      const response = cold('-b|', { b: interestRates });
      interestRateService.getInterestRate.and.returnValue(response);

      const expected = hot('--c', {
        c: loadInterestRatesSuccess({ interestRates }),
      });

      expectObservable(effects.loadInterestRates$).toEqual(expected);
    });
  });
});
