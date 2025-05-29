import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { DebtToIncomeComponent } from './debt-to-income.component';
import {
  calculateDti,
  resetDti,
} from '../../store/calculator/debt-to-income/dti.actions';
import { IDebtToIncome, IDebtToIncomeRequest } from '../../models/IDebt-To-Income';


describe('DebtToIncomeComponent', () => {
  let component: DebtToIncomeComponent;
  let fixture: ComponentFixture<DebtToIncomeComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
    storeMock.pipe.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [DebtToIncomeComponent,ReactiveFormsModule],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtToIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      annualIncome: 700000,
      minCreditCardPayments: 200,
      carLoanPayments: 500,
      studentLoanPayments: 3000,
    });
  });

  it('should mark form as invalid when values are negative', () => {
    component.form.patchValue({
      annualIncome: -1,
      minCreditCardPayments: -1,
      carLoanPayments: -1,
      studentLoanPayments: -1,
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should dispatch calculateDti action when form is valid and submitted', () => {
    component.onSubmit();
    const expectedRequest: IDebtToIncomeRequest = {
      AnnualIncome: 700000,
      MinCreditCardPayments: 200,
      CarLoanPayments: 500,
      StudentLoanPayments: 3000,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateDti({ request: expectedRequest })
    );
  });

  it('should not dispatch calculateDti action when form is invalid', () => {
    component.form.patchValue({ annualIncome: null });
    component.onSubmit();
    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });

  it('should reset form and dispatch resetDti action on reset', () => {
    component.onReset();
    expect(component.form.value).toEqual({
      annualIncome: 0,
      minCreditCardPayments: 0,
      carLoanPayments: 0,
      studentLoanPayments: 0,
    });
    expect(storeMock.dispatch).toHaveBeenCalledWith(resetDti());
  });

  it('should update proposedPaymentValue and submit form on slider change', () => {
    spyOn(component, 'onSubmit');
    component.onSliderChange(5000);
    expect(component.calculateDefaultPayment).toBeFalsy();
    expect(component.proposedPaymentValue).toBe(5000);
    expect(component.onSubmit).toHaveBeenCalled();
  });

  // it('should update component properties when result$ emits a value', () => {
  //   const mockResult: IDebtToIncome = {
  //     DtiPercentage: 30,
  //     TotalDebts: 1000,
  //     ProposedMonthlyPayment: 2000,
  //     RemainingMonthlyIncome: 3000,
  //   };
  //   storeMock.pipe.and.returnValue(of(mockResult));
  //   component.ngOnInit();
  //   expect(component.proposedPaymentValue).toBe(2000);
  //   expect(component.minSliderValue).toBe(1000);
  // });

  // it('should update component properties when result$ emits a value', fakeAsync(() => {
  //   const mockResult: IDebtToIncome = {
  //     DtiPercentage: 30,
  //     TotalDebts: 1000,
  //     ProposedMonthlyPayment: 2000,
  //     RemainingMonthlyIncome: 3000,
  //   };

  //   storeMock.pipe.and.returnValue(of(mockResult));
  //   component.ngOnInit();

  //   tick(); // Allow observable to emit and subscription to process

  //   expect(component.proposedPaymentValue).toBe(2000);
  //   expect(component.minSliderValue).toBe(1000);
  // }));  

  it('should handle edge case of zero annual income', () => {
    component.form.patchValue({ annualIncome: 0 });
    component.onSubmit();
    const expectedRequest: IDebtToIncomeRequest = {
      AnnualIncome: 0,
      MinCreditCardPayments: 200,
      CarLoanPayments: 500,
      StudentLoanPayments: 3000,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateDti({ request: expectedRequest })
    );
  });

  it('should handle maximum allowed values', () => {
    const maxValue = Number.MAX_SAFE_INTEGER;
    component.form.patchValue({
      annualIncome: maxValue,
      minCreditCardPayments: maxValue,
      carLoanPayments: maxValue,
      studentLoanPayments: maxValue,
    });
    component.onSubmit();
    const expectedRequest: IDebtToIncomeRequest = {
      AnnualIncome: maxValue,
      MinCreditCardPayments: maxValue,
      CarLoanPayments: maxValue,
      StudentLoanPayments: maxValue,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateDti({ request: expectedRequest })
    );
  });

  // it('should handle error state', () => {
  //   const errorMessage = 'Test error';
  //   storeMock.pipe.and.returnValue(of(errorMessage));
  //   component.ngOnInit();
  //   component.error$.subscribe((error) => {
  //     expect(error).toBe(errorMessage);
  //   });
  // });

  // Additional edge cases
  it('should handle fractional values for annual income', () => {
    component.form.patchValue({ annualIncome: 50000.5 });
    component.onSubmit();
    const expectedRequest: IDebtToIncomeRequest = {
      AnnualIncome: 50000.5,
      MinCreditCardPayments: 200,
      CarLoanPayments: 500,
      StudentLoanPayments: 3000,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateDti({ request: expectedRequest })
    );
  });

  it('should handle very small non-zero values', () => {
    const smallValue = 0.00001;
    component.form.patchValue({
      annualIncome: smallValue,
      minCreditCardPayments: smallValue,
      carLoanPayments: smallValue,
      studentLoanPayments: smallValue,
    });
    component.onSubmit();
    const expectedRequest: IDebtToIncomeRequest = {
      AnnualIncome: smallValue,
      MinCreditCardPayments: smallValue,
      CarLoanPayments: smallValue,
      StudentLoanPayments: smallValue,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateDti({ request: expectedRequest })
    );
  });

  it('should handle case when all input values are zero', () => {
    component.form.patchValue({
      annualIncome: 0,
      minCreditCardPayments: 0,
      carLoanPayments: 0,
      studentLoanPayments: 0,
    });
    component.onSubmit();
    const expectedRequest: IDebtToIncomeRequest = {
      AnnualIncome: 0,
      MinCreditCardPayments: 0,
      CarLoanPayments: 0,
      StudentLoanPayments: 0,
      ProposedMonthlyPayment: 0,
      CalculateDefaultPayment: true,
    };
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateDti({ request: expectedRequest })
    );
  });
});
