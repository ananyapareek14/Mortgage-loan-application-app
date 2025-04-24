import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoanApplicationComponent } from './loan-application.component';
import { addLoan, clearLastAddedLoan } from '../store/loan/loan.actions';
import { loadInterestRates } from '../store/interest-rates/interest-rate.actions';
import { ILoan } from '../models/ILoan';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Loan Application Component', () => {
  let component: LoanApplicationComponent;
  let fixture: ComponentFixture<LoanApplicationComponent>;
  let storeMock: jasmine.SpyObj<Store>;
  let toastrMock: jasmine.SpyObj<ToastrService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoanApplicationComponent,ReactiveFormsModule],
      providers: [
        provideAnimations(),
        { provide: Store, useValue: storeSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    storeMock = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    toastrMock = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationComponent);
    component = fixture.componentInstance;
    storeMock.select.and.returnValue(of(null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.loanForm.get('LoanAmount')?.value).toBeUndefined();
    expect(component.loanForm.get('InterestRate')?.value).toBeUndefined();
    expect(component.loanForm.get('LoanTermYears')?.value).toBeUndefined();
    expect(component.loanForm.get('UserLoanNumber')?.value).toBeUndefined();
    expect(component.loanForm.get('ApplicationDate')?.value).toBeUndefined();
    expect(component.loanForm.get('ApprovalStatus')?.value).toBeUndefined();
  });

  it('should dispatch loadInterestRates action on init', () => {
    expect(storeMock.dispatch).toHaveBeenCalledWith(loadInterestRates());
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled correctly', () => {
    const validLoan: ILoan = {
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    };
    component.loanForm.setValue(validLoan);
    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should show error toast when submitting invalid form', () => {
    component.submitLoan();
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'Invalid Form'
    );
  });

  it('should dispatch addLoan action when submitting valid form', () => {
    const testLoan: ILoan = {
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    };
    component.loanForm.setValue(testLoan);
    component.submitLoan();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      addLoan({ loan: testLoan })
    );
  });

  it('should reset form after successful submission', () => {
    const testLoan: ILoan = {
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    };
    component.loanForm.setValue(testLoan);
    component.submitLoan();
    expect(component.loanForm.value).toEqual({
      UserLoanNumber: null,
      LoanAmount: null,
      InterestRate: null,
      LoanTermYears: null,
      ApplicationDate: null,
      ApprovalStatus: null,
    });
  });

  it('should navigate to dashboard on successful loan addition', () => {
    storeMock.select.and.returnValue(of(true));
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show success toast on successful loan addition', () => {
    storeMock.select.and.returnValue(of(true));
    component.ngOnInit();
    expect(toastrMock.success).toHaveBeenCalledWith(
      'Loan application submitted successfully!',
      'Success'
    );
  });

  it('should dispatch clearLastAddedLoan action after successful loan addition', () => {
    storeMock.select.and.returnValue(of(true));
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(clearLastAddedLoan());
  });

  // Edge cases
  it('should not allow loan amount less than 1000', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: 999,
      InterestRate: 5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should not allow loan term less than 1 year', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 0,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should allow maximum possible loan amount', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: Number.MAX_SAFE_INTEGER,
      InterestRate: 5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should handle floating point interest rates', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: 5.25,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should not allow negative loan amounts', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: -5000,
      InterestRate: 5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should not allow negative interest rates', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: -5,
      LoanTermYears: 3,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should handle very long loan terms', () => {
    component.loanForm.setValue({
      UserLoanNumber: 12345,
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 100,
      ApplicationDate: '2023-05-20',
      ApprovalStatus: 'Pending',
    });
    expect(component.loanForm.valid).toBeTruthy();
  });
});
