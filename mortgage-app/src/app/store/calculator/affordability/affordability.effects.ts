import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  calculateAffordability,
  calculateAffordabilitySuccess,
  calculateAffordabilityFailure,
} from './affordability.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CalculatorService } from '../../../services/calculator/calculators.service';

@Injectable()
export class AffordabilityEffects {
  private actions$ = inject(Actions);
  private calculatorService = inject(CalculatorService);

  calculateAffordability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calculateAffordability),
      mergeMap(({ request }) =>
        this.calculatorService.calculateAffordability(request).pipe(
          map((result) => calculateAffordabilitySuccess({ result })),
          catchError((error) =>
            of(calculateAffordabilityFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
