import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InterestRateService } from '../../services/interestRate/interest-rate.service';
import {
  loadInterestRates,
  loadInterestRatesSuccess,
  loadInterestRatesFailure,
} from './interest-rate.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class InterestRateEffects {
  private actions$ = inject(Actions);
  private interestRateService = inject(InterestRateService);

  loadInterestRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInterestRates),
      mergeMap(() =>
        this.interestRateService.getInterestRate().pipe(
          map((interestRates) => loadInterestRatesSuccess({ interestRates })),
          catchError((error) =>
            of(loadInterestRatesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
