import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  calculateVaMortgage,
  calculateVaMortgageSuccess,
  calculateVaMortgageFailure,
} from './va-mortgage.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { CalculatorService } from '../../../services/calculator/calculators.service';
import { IVaMortgageRequest } from '../../../models/IVaMortgage';

@Injectable()
export class VaMortgageEffects {
    private actions$ = inject(Actions);
    private calculatorService = inject(CalculatorService)

  calculateVaMortgage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calculateVaMortgage),
      mergeMap(({ request }: { request: IVaMortgageRequest }) =>
        this.calculatorService.calculateVaMortgage(request).pipe(
          map((result) => calculateVaMortgageSuccess({ result })),
          catchError((error) =>
            of(calculateVaMortgageFailure({ error: error.message || 'Unknown error' }))
          )
        )
      )
    )
  );
}