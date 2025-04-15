import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanApplicationComponent } from './loan-application.component';
import { Store } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { addLoan, clearLastAddedLoan } from '../store/loan/loan.actions';
import { loadInterestRates } from '../store/interest-rates/interest-rate.actions';
import { selectAllInterestRates } from '../store/interest-rates/interest-rate.selectors';
import { ILoan } from '../models/ILoan';
import { IInterestRate } from '../models/IInterestRate';
import { selectLoanAddSuccess } from '../store/loan/loan.selectors';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Loan Application Component', () => {
  let component: LoanApplicationComponent;
  let fixture: ComponentFixture<LoanApplicationComponent>;
  let store: jasmine.SpyObj<Store>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    toastr = jasmine.createSpyObj('ToastrService', [
      'success',
      'info',
      'error',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, LoanApplicationComponent],
      providers: [
        FormBuilder,
        provideAnimations(),
        { provide: Store, useValue: store },
        { provide: ToastrService, useValue: toastr },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanApplicationComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    store.select.and.callFake((selector: any) => {
      if (selector === selectAllInterestRates) {
        return of([
          {
            Id: '1', // Adding missing properties
            Rate: 5.5,
            ValidFrom: '2023-01-01',
          } as IInterestRate,
        ]);
      }
      return of([]);
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadInterestRates on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadInterestRates());
  });

  it('should submit loan form when form is valid', () => {
    const validLoan: ILoan = {
      LoanId: 0,
      UserLoanNumber: 1,
      LoanAmount: 150000,
      InterestRate: 5.5,
      LoanTermYears: 30,
      ApplicationDate: new Date().toISOString(),
      ApprovalStatus: 'Pending',
    };

    component.loanForm.setValue({
      LoanAmount: validLoan.LoanAmount,
      InterestRate: validLoan.InterestRate,
      LoanTermYears: validLoan.LoanTermYears,
    });

    component.submitLoan();

    expect(store.dispatch).toHaveBeenCalledWith(
      addLoan({
        loan: jasmine.objectContaining({
          LoanAmount: validLoan.LoanAmount,
          InterestRate: validLoan.InterestRate,
          LoanTermYears: validLoan.LoanTermYears,
          ApplicationStatus: 'Pending',
        }) as unknown as ILoan,
      })
    );

    expect(toastr.success).toHaveBeenCalledWith(
      'Loan application submitted successfully!',
      'Success'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error when form is invalid', () => {
    component.loanForm.setValue({
      LoanAmount: '',
      InterestRate: '',
      LoanTermYears: '',
    });

    component.submitLoan();

    expect(toastr.error).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'Invalid Form'
    );
  });

  it('should handle loan add success and clear last added loan', () => {
    store.select.and.callFake((selector: any) => {
      if (selector === selectLoanAddSuccess) {
        return of(true);
      }
      return of([]);
    });

    component.ngOnInit(); // triggers the subscription for success

    expect(store.dispatch).toHaveBeenCalledWith(clearLastAddedLoan());
    expect(toastr.info).toHaveBeenCalledWith(
      'Redirecting to dashboard...',
      'Redirecting'
    );
    expect(toastr.success).toHaveBeenCalledWith(
      'Loan application submitted successfully!',
      'Success'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
