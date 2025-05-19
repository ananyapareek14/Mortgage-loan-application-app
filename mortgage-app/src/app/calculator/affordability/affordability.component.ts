// import { Component, inject } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { select, Store } from '@ngrx/store';
// import { selectAffordabilityError, selectAffordabilityLoading, selectAffordabilityResult } from '../../store/calculator/affordability/affordability.selectors';
// import { calculateAffordability, resetAffordability } from '../../store/calculator/affordability/affordability.actions';

// @Component({
//   selector: 'app-affordability',
//   imports: [],
//   templateUrl: './affordability.component.html',
//   styleUrl: './affordability.component.css',
// })
// export class AffordabilityComponent {
//   private store = inject(Store);
//   private fb = inject(FormBuilder);

//   form = this.fb.group({
//     annualIncome: [0, [Validators.required, Validators.min(0)]],
//     monthlyDebts: [0, [Validators.required, Validators.min(0)]],
//     downPayment: [0, [Validators.required, Validators.min(0)]],
//     interestRate: [0, [Validators.required, Validators.min(0)]],
//     loanTermYears: [30, [Validators.required, Validators.min(1)]],
//   });

//   result$ = this.store.pipe(select(selectAffordabilityResult));
//   loading$ = this.store.pipe(select(selectAffordabilityLoading));
//   error$ = this.store.pipe(select(selectAffordabilityError));

//   onSubmit() {
//     if (this.form.valid) {
//       this.store.dispatch(
//         calculateAffordability({ request: this.form.getRawValue() })
//       );
//     } else {
//       this.form.markAllAsTouched();
//     }
//   }

//   onReset() {
//     this.store.dispatch(resetAffordability());
//     this.form.reset({
//       annualIncome: 0,
//       monthlyDebts: 0,
//       downPayment: 0,
//       interestRate: 0,
//       loanTermYears: 30,
//     });
//   }
// }


import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  selectAffordabilityError,
  selectAffordabilityLoading,
  selectAffordabilityResult,
} from '../../store/calculator/affordability/affordability.selectors';
import {
  calculateAffordability,
  resetAffordability,
} from '../../store/calculator/affordability/affordability.actions';
import { IAffordabilityRequest } from '../../models/IAffordability';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-affordability',
  imports: [CurrencyPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './affordability.component.html',
  styleUrl: './affordability.component.css',
})
export class AffordabilityComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    annualIncome: [0, [Validators.required, Validators.min(0)]],
    monthlyDebts: [0, [Validators.required, Validators.min(0)]],
    downPayment: [0, [Validators.required, Validators.min(0)]],
    interestRate: [0, [Validators.required, Validators.min(0)]],
    loanTermYears: [30, [Validators.required, Validators.min(1)]],
  });

  result$ = this.store.pipe(select(selectAffordabilityResult));
  loading$ = this.store.pipe(select(selectAffordabilityLoading));
  error$ = this.store.pipe(select(selectAffordabilityError));

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();

      const request: IAffordabilityRequest = {
        AnnualIncome: raw.annualIncome ?? 0,
        MonthlyDebts: raw.monthlyDebts ?? 0,
        DownPayment: raw.downPayment ?? 0,
        InterestRate: raw.interestRate ?? 0,
        LoanTermMonths: (raw.loanTermYears ?? 0),
      };

      this.store.dispatch(calculateAffordability({ request }));
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.store.dispatch(resetAffordability());
    this.form.reset({
      annualIncome: 0,
      monthlyDebts: 0,
      downPayment: 0,
      interestRate: 0,
      loanTermYears: 30,
    });
  }
}
