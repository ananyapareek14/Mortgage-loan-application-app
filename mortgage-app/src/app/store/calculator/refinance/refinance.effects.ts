import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  calculateRefinance,
  calculateRefinanceSuccess,
  calculateRefinanceFailure,
} from './refinance.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CalculatorService } from '../../../services/calculator/calculators.service';

@Injectable()
export class RefinanceEffects {
  private actions$ = inject(Actions);
  private refinanceService = inject(CalculatorService);

  calculateRefinance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calculateRefinance),
      mergeMap(({ request }) =>
        this.refinanceService.calculateRefinance(request).pipe(
          map((result) => calculateRefinanceSuccess({ result })),
          catchError((error) =>
            of(calculateRefinanceFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
