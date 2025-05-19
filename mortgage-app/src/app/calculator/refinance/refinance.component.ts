// import { Component, inject } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { select, Store } from '@ngrx/store';
// import {
//   selectRefinanceError,
//   selectRefinanceLoading,
//   selectRefinanceResult,
// } from '../../store/calculator/refinance/refinance.selectors';
// import {
//   calculateRefinance,
//   resetRefinance,
// } from '../../store/calculator/refinance/refinance.actions';

// @Component({
//   selector: 'app-refinance',
//   imports: [],
//   templateUrl: './refinance.component.html',
//   styleUrl: './refinance.component.css',
// })
// export class RefinanceComponent {
//   private store = inject(Store);
//   private fb = inject(FormBuilder);

//   form = this.fb.group({
//     currentLoanAmount: [0, [Validators.required, Validators.min(0)]],
//     interestRate: [0, [Validators.required, Validators.min(0)]],
//     currentTermMonths: [360, [Validators.required, Validators.min(1)]],
//     originationYear: [2020, [Validators.required, Validators.min(1900)]],
//     newLoanAmount: [0, [Validators.required, Validators.min(0)]],
//     newInterestRate: [0, [Validators.required, Validators.min(0)]],
//     termMonths: [360, [Validators.required, Validators.min(1)]],
//     refinanceFees: [0, [Validators.required, Validators.min(0)]],
//   });

//   result$ = this.store.pipe(select(selectRefinanceResult));
//   loading$ = this.store.pipe(select(selectRefinanceLoading));
//   error$ = this.store.pipe(select(selectRefinanceError));

//   onSubmit() {
//     if (this.form.valid) {
//       const formValue = this.form.getRawValue();

//       // Transform camelCase to PascalCase keys as expected by backend
//       const request = {
//         CurrentLoanAmount: formValue.currentLoanAmount,
//         InterestRate: formValue.interestRate,
//         CurrentTermMonths: formValue.currentTermMonths,
//         OriginationYear: formValue.originationYear,
//         NewLoanAmount: formValue.newLoanAmount,
//         NewInterestRate: formValue.newInterestRate,
//         TermMonths: formValue.termMonths,
//         RefinanceFees: formValue.refinanceFees,
//       };

//       this.store.dispatch(calculateRefinance({ request }));
//     } else {
//       this.form.markAllAsTouched();
//     }
//   }

//   onReset() {
//     this.store.dispatch(resetRefinance());
//     this.form.reset({
//       currentLoanAmount: 0,
//       interestRate: 0,
//       currentTermMonths: 360,
//       originationYear: 2020,
//       newLoanAmount: 0,
//       newInterestRate: 0,
//       termMonths: 360,
//       refinanceFees: 0,
//     });
//   }
// }


import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import {
  calculateRefinance,
  resetRefinance,
} from '../../store/calculator/refinance/refinance.actions';
import {
  selectRefinanceError,
  selectRefinanceLoading,
  selectRefinanceResult,
} from '../../store/calculator/refinance/refinance.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refinance',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './refinance.component.html',
  styleUrl: './refinance.component.css',
})
export class RefinanceComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    currentLoanAmount: [0, [Validators.required, Validators.min(0)]],
    interestRate: [0, [Validators.required, Validators.min(0)]],
    currentTermMonths: [360, [Validators.required, Validators.min(1)]],
    originationYear: [2020, [Validators.required, Validators.min(1900)]],
    newLoanAmount: [0, [Validators.required, Validators.min(0)]],
    newInterestRate: [0, [Validators.required, Validators.min(0)]],
    termMonths: [360, [Validators.required, Validators.min(1)]],
    refinanceFees: [0, [Validators.required, Validators.min(0)]],
  });

  result$ = this.store.pipe(select(selectRefinanceResult));
  loading$ = this.store.pipe(select(selectRefinanceLoading));
  error$ = this.store.pipe(select(selectRefinanceError));

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();

      const request = {
        CurrentLoanAmount: formValue.currentLoanAmount ?? 0,
        InterestRate: formValue.interestRate ?? 0,
        CurrentTermMonths: formValue.currentTermMonths ?? 0,
        OriginationYear: formValue.originationYear ?? 0,
        NewLoanAmount: formValue.newLoanAmount ?? 0,
        NewInterestRate: formValue.newInterestRate ?? 0,
        TermMonths: formValue.termMonths ?? 0,
        RefinanceFees: formValue.refinanceFees ?? 0,
      };

      this.store.dispatch(calculateRefinance({ request }));
      console.log('Form submitted:', request);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.store.dispatch(resetRefinance());
    this.form.reset({
      currentLoanAmount: 0,
      interestRate: 0,
      currentTermMonths: 360,
      originationYear: 2020,
      newLoanAmount: 0,
      newInterestRate: 0,
      termMonths: 360,
      refinanceFees: 0,
    });
  }
}
