import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CalculatorService } from '../../../services/calculator/calculators.service';
import { calculateRefinance, calculateRefinanceFailure, calculateRefinanceSuccess } from './refinance.actions';

@Injectable()
export class RefinanceEffects {
  private actions$ = inject(Actions);
  private refinanceService = inject(CalculatorService);

  calculateRefinance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calculateRefinance),
      tap(({ request }) => {
        console.log('🟡 Dispatched Action: calculateRefinance');
        console.table(request);
      }),
      mergeMap(({ request }) =>
        this.refinanceService.calculateRefinance(request).pipe(
          tap((apiResult) => {
            console.log('🟢 API Response Received:', apiResult);
          }),
          map((result) => {
            console.log('✅ Dispatching Success Action');
            return calculateRefinanceSuccess({ result });
          }),
          catchError((error) => {
            console.error('🔴 API Error:', error);
            return of(calculateRefinanceFailure({ error: error.message }));
          })
        )
      )
    )
  );
}