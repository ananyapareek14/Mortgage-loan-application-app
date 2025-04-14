import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { InterestRateEffects } from './interest-rate.effects';
import { InterestRateService } from '../../services/interestRate/interest-rate.service';
import * as fromActions from './interest-rate.actions';
import { provideMockActions } from '@ngrx/effects/testing';

describe('Interest Rate Effects', () => {
  let actions$: Actions;
  let effects: InterestRateEffects;
  let interestRateService: jasmine.SpyObj<InterestRateService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('InterestRateService', ['getInterestRate']);

    TestBed.configureTestingModule({
      providers: [
        InterestRateEffects,
        { provide: InterestRateService, useValue: spy },
        provideMockActions(() => actions$), // Use provideMockActions to mock Actions
      ],
    });

    effects = TestBed.inject(InterestRateEffects);
    interestRateService = TestBed.inject(InterestRateService) as jasmine.SpyObj<InterestRateService>;
  });

  it('should load interest rates successfully', (done) => {
    const interestRates = [
      { Id: '1', Rate: 5, ValidFrom: '2021-01-01' },
    ];
    interestRateService.getInterestRate.and.returnValue(of(interestRates));

    const action = fromActions.loadInterestRates();
    const expectedAction = fromActions.loadInterestRatesSuccess({ interestRates });

    actions$ = of(action);

    effects.loadInterestRates$.subscribe((result) => {
      expect(result).toEqual(expectedAction);
      done();
    });
  });

  it('should handle failure to load interest rates', (done) => {
    const error = 'Failed to load interest rates';
    // Return an error observable for failure scenario
    interestRateService.getInterestRate.and.returnValue(throwError(() => new Error(error)));

    const action = fromActions.loadInterestRates();
    const expectedAction = fromActions.loadInterestRatesFailure({ error });

    actions$ = of(action);

    effects.loadInterestRates$.subscribe((result) => {
      expect(result).toEqual(expectedAction);
      done();
    });
  });
});
