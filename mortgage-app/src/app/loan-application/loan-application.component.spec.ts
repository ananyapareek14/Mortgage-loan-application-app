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
    expect(component.loanForm.get('LoanAmount')?.value).toBe('');
    expect(component.loanForm.get('InterestRate')?.value).toBe('');
    expect(component.loanForm.get('LoanTermYears')?.value).toBe('');
  });

  it('should dispatch loadInterestRates action on init', () => {
    expect(storeMock.dispatch).toHaveBeenCalledWith(loadInterestRates());
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled correctly', () => {
    component.loanForm.setValue({
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 3,
    });

    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should show error toast when submitting invalid form', () => {
    component.submitLoan();
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'Invalid Form'
    );
  });

  it('should reset form after successful submission', () => {
    component.loanForm.setValue({
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 3,
    });
    component.submitLoan();
    expect(component.loanForm.value).toEqual({
      LoanAmount: null,
      InterestRate: null,
      LoanTermYears: null,
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
      LoanAmount: 500,
      InterestRate: 5,
      LoanTermYears: 3,
    });

    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should not allow loan term less than 1 year', () => {
    component.loanForm.setValue({
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 0,
    });

    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should allow maximum possible loan amount', () => {
    component.loanForm.setValue({
  LoanAmount: Number.MAX_SAFE_INTEGER,
  InterestRate: 5,
  LoanTermYears: 3,
});

    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should handle floating point interest rates', () => {
    component.loanForm.setValue({
      LoanAmount: 5000,
      InterestRate: 5.25,
      LoanTermYears: 3,
    });

    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should not allow negative loan amounts', () => {
    component.loanForm.setValue({
      LoanAmount: -5000,
      InterestRate: 5,
      LoanTermYears: 3,
    });

    expect(component.loanForm.valid).toBeFalsy();
  });

  it('should handle very long loan terms', () => {
    component.loanForm.setValue({
      LoanAmount: 5000,
      InterestRate: 5,
      LoanTermYears: 100,
    });

    expect(component.loanForm.valid).toBeTruthy();
  });
});
