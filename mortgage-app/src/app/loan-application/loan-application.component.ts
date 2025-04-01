import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoanService } from '../services/loan/loan.service';
import { ILoan } from '../models/ILoan';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { IInterestRate } from '../models/IInterestRate';
import { InterestRateService } from '../services/interestRate/interest-rate.service';
import { addLoan } from '../store/loan/loan.actions';

@Component({
  selector: 'app-loan-application',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.css'
})
export class LoanApplicationComponent implements OnInit {
  loanForm!: FormGroup;
  interestRates$! : Observable<IInterestRate[]>;

  constructor(private fb: FormBuilder, private store: Store, private loanService: LoanService, private interestService: InterestRateService) {}

  ngOnInit() : void {
    this.loanForm = this.fb.group({
      LoanAmount: ['', [Validators.required], Validators.min(1000)],
      InterestRate: ['', Validators.required],
      LoanTermYears: ['', Validators.required, Validators.min(1)],
    });

    // this.interestRates$ = this.store.select(selectAllInterestRates);
    // this.fetchInterestRates();
  }

  // fetchInterestRates(){
  //   this.interestService.getInterestRate().subscribe({
  //     next: (rates) => {
  //       this.store.dispatch(loadInterestRatesSuccess({interestRates: rates}));
  //     },
  //     error: (err) => {
  //       this.store.dispatch(loadInterestRatesFailure({error: err.message}));
  //     }
  //   })
  // }

  submitLoan() {
    if (this.loanForm.valid) {
      const newLoan: ILoan = {
        LoanId: 0,
        ...this.loanForm.value,
        ApplicationDate: new Date().toISOString(),
        ApplicationStatus: 'Pending',
      };

      this.store.dispatch(addLoan({ loan: newLoan }));

      alert('Loan application submitted successfully!');
      this.loanForm.reset();
    }
  }
}
