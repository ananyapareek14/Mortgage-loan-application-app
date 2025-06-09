import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { DebtToIncomeComponent } from './debt-to-income.component';
import {
  calculateDti,
  resetDti,
} from '../../store/calculator/debt-to-income/dti.actions';
import { IDebtToIncome, IDebtToIncomeRequest } from '../../models/IDebt-To-Income';
import { selectDtiResult } from '../../store/calculator/debt-to-income/dti.selectors';


describe('DebtToIncomeComponent', () => {
  let component: DebtToIncomeComponent;
  let fixture: ComponentFixture<DebtToIncomeComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
    storeMock.pipe.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [DebtToIncomeComponent,ReactiveFormsModule, FormsModule],
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

  // it('should update values when result$ emits a value', fakeAsync(() => {
  //   // Arrange: Provide a valid result value
  //   const mockResult = {
  //     ProposedMonthlyPayment: 4500,
  //     TotalDebts: 3000,
  //   };
  
  //   // Patch income into the form
  //   component.form.patchValue({ annualIncome: 120000 });
  
  //   // Replace store.pipe with one that returns mock result
  //   storeMock.pipe.and.callFake((...args: any[]) => {
  //     const selector = args[0];
  //     if (selector === selectDtiResult) return of(mockResult);
  //     // return of(null);
  //     return of({})
  //   });
  
  //   // Re-trigger component setup
  //   fixture = TestBed.createComponent(DebtToIncomeComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   tick(); // flush observables
  
  //   // Assert updated values
  //   expect(component.proposedPaymentValue).toBe(4500);
  //   expect(component.minSliderValue).toBe(3000);
  
  //   const expectedMaxSlider = Math.max(3000 + 100, 120000 / 12 - 100); // = max(3100, 9000)
  //   expect(component.maxSliderValue).toBe(expectedMaxSlider);
  // }));

  // it('should update values when result$ emits a value', fakeAsync(() => {
  //   const mockResult = {
  //     ProposedMonthlyPayment: 4500,
  //     TotalDebts: 3000,
  //   };

  //   // Patch income before change detection
  //   component.form.patchValue({ annualIncome: 120000 });

  //   // Mock select call
  //   storeMock.select.and.callFake((selector: any) => {
  //     if (selector === selectDtiResult) {
  //       return of(mockResult);
  //     }
  //     return of(null);
  //   });

  //   fixture.detectChanges();
  //   tick();

  //   expect(component.proposedPaymentValue).toBe(4500);
  //   expect(component.minSliderValue).toBe(3000);
  //   expect(component.maxSliderValue).toBe(Math.max(3100, 120000 / 12 - 100));
  // }));  
});
