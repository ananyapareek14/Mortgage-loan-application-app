import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AmortizationService } from '../../services/amortization/amortization.service';
import {
  loadAmortizationSchedule,
  loadAmortizationScheduleSuccess,
  loadAmortizationScheduleFailure,
  calculateAmortization,
  calculateAmortizationSuccess,
  calculateAmortizationFailure,
} from './amortization.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AmortizationEffects {
  private actions$ = inject(Actions);
  private amortizationService = inject(AmortizationService);

  // Load amortization schedule effect
  loadAmortization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAmortizationSchedule),
      mergeMap(({ userLoanNumber }) =>
        this.amortizationService.getAmortizationByLoanId(userLoanNumber).pipe(
          map((schedule) => loadAmortizationScheduleSuccess({ schedule })),
          catchError((error) =>
            of(loadAmortizationScheduleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Calculate amortization effect
  calculateAmortization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calculateAmortization),
      mergeMap(({ request }) =>
        this.amortizationService.calculateAmortization(request).pipe(
          map((schedule) => calculateAmortizationSuccess({ schedule })),
          catchError((error) =>
            of(calculateAmortizationFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
