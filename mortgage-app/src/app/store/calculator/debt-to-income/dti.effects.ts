import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DtiActions from './dti.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { CalculatorService } from '../../../services/calculator/calculators.service';

@Injectable()
export class DtiEffects {
  private action$ = inject(Actions);
  private calculatorService = inject(CalculatorService);

  calculateDti$ = createEffect(() =>
    this.action$.pipe(
      ofType(DtiActions.calculateDti),
            mergeMap(({ request }) =>
              this.calculatorService.calculateDti(request).pipe(
                map((result) => DtiActions.calculateDtiSuccess({ result })),
                catchError((error) => of(DtiActions.calculateDtiFailure({ error })))
                )
        )
    ),
    {functional:true}
  );
}


// export const dtiEffects = createEffect(
//   (actions$ = inject(Actions), dtiService = inject(CalculatorService)) =>
//     actions$.pipe(
//       ofType(DtiActions.calculateDti),
//       mergeMap(({ request }) =>
//         dtiService.calculateDti(request).pipe(
//           map((result) => DtiActions.calculateDtiSuccess({ result })),
//           catchError((error) => of(DtiActions.calculateDtiFailure({ error })))
//         )
//       )
//     ),
//   { functional: true }
// );
