import { TestBed } from '@angular/core/testing';
import { AmortizationEffects } from './amortization.effects';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { AmortizationService } from '../../services/amortization/amortization.service';
import * as fromActions from './amortization.actions';
import { RouterTestingModule } from '@angular/router/testing';

describe('Amortization Effects', () => {
  let actions$: Actions;
  let effects: AmortizationEffects;
  let amortizationService: jasmine.SpyObj<AmortizationService>;
  let store: MockStore;

  beforeEach(() => {
    const amortizationServiceSpy = jasmine.createSpyObj('AmortizationService', ['getAmortizationByLoanId', 'calculateAmortization']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AmortizationEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: AmortizationService, useValue: amortizationServiceSpy }
      ]
    });

    effects = TestBed.inject(AmortizationEffects);
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(MockStore);
    amortizationService = TestBed.inject(AmortizationService) as jasmine.SpyObj<AmortizationService>;
  });

  it('should dispatch loadAmortizationScheduleSuccess when loadAmortizationSchedule is successful', () => {
    const userLoanNumber = 123;
    const schedule = [{ PaymentNumber: 1, PaymentDate: new Date(), MonthlyPayment: 1000, PrincipalPayment: 900, InterestPayment: 100, RemainingBalance: 9900 }];
    actions$ = of(fromActions.loadAmortizationSchedule({ userLoanNumber }));

    amortizationService.getAmortizationByLoanId.and.returnValue(of(schedule));

    effects.loadAmortization$.subscribe(action => {
      expect(action).toEqual(fromActions.loadAmortizationScheduleSuccess({ schedule }));
    });
  });

  it('should dispatch loadAmortizationScheduleFailure when loadAmortizationSchedule fails', () => {
    const userLoanNumber = 123;
    const error = 'Failed to load schedule';
    actions$ = of(fromActions.loadAmortizationSchedule({ userLoanNumber }));

    amortizationService.getAmortizationByLoanId.and.returnValue(throwError({ message: error }));

    effects.loadAmortization$.subscribe(action => {
      expect(action).toEqual(fromActions.loadAmortizationScheduleFailure({ error }));
    });
  });

  it('should dispatch calculateAmortizationSuccess when calculateAmortization is successful', () => {
    const request = { LoanAmount: 100000, InterestRate: 5, LoanTermYears: 30 };
    const schedule = [{ PaymentNumber: 1, PaymentDate: new Date(), MonthlyPayment: 1000, PrincipalPayment: 900, InterestPayment: 100, RemainingBalance: 9900 }];
    actions$ = of(fromActions.calculateAmortization({ request }));

    amortizationService.calculateAmortization.and.returnValue(of(schedule));

    effects.calculateAmortization$.subscribe(action => {
      expect(action).toEqual(fromActions.calculateAmortizationSuccess({ schedule }));
    });
  });

  it('should dispatch calculateAmortizationFailure when calculateAmortization fails', () => {
    const request = { LoanAmount: 100000, InterestRate: 5, LoanTermYears: 30 };
    const error = 'Calculation failed';
    actions$ = of(fromActions.calculateAmortization({ request }));

    amortizationService.calculateAmortization.and.returnValue(throwError({ message: error }));

    effects.calculateAmortization$.subscribe(action => {
      expect(action).toEqual(fromActions.calculateAmortizationFailure({ error }));
    });
  });
});
