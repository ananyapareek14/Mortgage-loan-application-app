import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AffordabilityComponent } from './affordability.component';
import {
  calculateAffordability,
  resetAffordability,
} from '../../store/calculator/affordability/affordability.actions';
import { Chart } from 'chart.js';
import { IAffordability, IAffordabilityRequest } from '../../models/IAffordability';


describe('AffordabilityComponent', () => {
  let component: AffordabilityComponent;
  let fixture: ComponentFixture<AffordabilityComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);

    await TestBed.configureTestingModule({
      imports: [AffordabilityComponent,ReactiveFormsModule],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AffordabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.chart) {
      component.chart.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      annualIncome: 700000,
      monthlyDebts: 2500,
      downPayment: 200000,
      interestRate: 6.5,
      loanTermYears: 30,
    });
  });

  it('should dispatch calculateAffordability action on ngOnInit', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateAffordability({
        request: {
          AnnualIncome: 700000,
          MonthlyDebts: 2500,
          DownPayment: 200000,
          InterestRate: 6.5,
          LoanTermMonths: 360,
        } as IAffordabilityRequest,
      })
    );
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.form.controls['annualIncome'].setValue(null);
    component.onSubmit();
    expect(component.form.touched).toBeTrue();
  });

  it('should dispatch calculateAffordability action when submitting valid form', () => {
    component.onSubmit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateAffordability({
        request: {
          AnnualIncome: 700000,
          MonthlyDebts: 2500,
          DownPayment: 200000,
          InterestRate: 6.5,
          LoanTermMonths: 360,
        } as IAffordabilityRequest,
      })
    );
  });

  it('should reset form and dispatch resetAffordability action on reset', () => {
    component.onReset();
    expect(storeMock.dispatch).toHaveBeenCalledWith(resetAffordability());
    expect(component.form.value).toEqual({
      annualIncome: 0,
      monthlyDebts: 0,
      downPayment: 0,
      interestRate: 0,
      loanTermYears: 30,
    });
  });

  it('should set active tab and render chart when switching to breakdown tab', () => {
    spyOn(component as any, 'renderChart');
    const mockAffordability: IAffordability = {
      MaxAffordableHomePrice: 500000,
      EstimatedLoanAmount: 300000,
      EstimatedMonthlyPayment: 2000,
      DtiPercentage: 36,
      AnnualIncome: 700000,
      DownPayment: 200000,
      LoanTermMonths: 360,
      InterestRate: 6.5,
      MonthlyDebts: 2500,
    };
    storeMock.pipe.and.returnValue(of(mockAffordability));
    component.setActiveTab('breakdown');
    expect(component.activeTab).toBe('breakdown');
    setTimeout(() => {
      expect((component as any).renderChart).toHaveBeenCalledWith(2000, 500000);
    }, 0);
  });

  it('should destroy chart when switching away from breakdown tab', () => {
    component.chart = new Chart('test', {
      type: 'doughnut',
      data: { labels: [], datasets: [] },
    });
    spyOn(component.chart, 'destroy');
    component.setActiveTab('summary');
    expect(component.chart).toBeNull();
  });

  it('should handle edge case of zero values in form', () => {
    component.form.patchValue({
      annualIncome: 0,
      monthlyDebts: 0,
      downPayment: 0,
      interestRate: 0,
      loanTermYears: 0,
    });
    component.onSubmit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateAffordability({
        request: {
          AnnualIncome: 0,
          MonthlyDebts: 0,
          DownPayment: 0,
          InterestRate: 0,
          LoanTermMonths: 0,
        } as IAffordabilityRequest,
      })
    );
  });

  it('should handle boundary condition of maximum allowed values', () => {
    const maxValue = Number.MAX_SAFE_INTEGER;
    component.form.patchValue({
      annualIncome: maxValue,
      monthlyDebts: maxValue,
      downPayment: maxValue,
      interestRate: 100, // Maximum possible interest rate
      loanTermYears: 100, // Unrealistically long loan term
    });
    component.onSubmit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateAffordability({
        request: {
          AnnualIncome: maxValue,
          MonthlyDebts: maxValue,
          DownPayment: maxValue,
          InterestRate: 100,
          LoanTermMonths: 1200,
        } as IAffordabilityRequest,
      })
    );
  });

  // it('should handle error when chart canvas is not available', () => {
  //   component.breakdownChartCanvas = undefined;
  //   expect(() => (component as any).renderChart(2000, 500000)).not.toThrow();
  // });

  // it('should handle negative values in form', () => {
  //   component.form.patchValue({
  //     annualIncome: -100000,
  //     monthlyDebts: -1000,
  //     downPayment: -50000,
  //     interestRate: -5,
  //     loanTermYears: -10,
  //   });
  //   component.onSubmit();
  //   expect(storeMock.dispatch).not.toHaveBeenCalled();
  //   expect(component.form.valid).toBeFalse();
  // });

  it('should handle fractional values for loan term years', () => {
    component.form.patchValue({
      loanTermYears: 15.5,
    });
    component.onSubmit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      calculateAffordability({
        request: {
          AnnualIncome: 700000,
          MonthlyDebts: 2500,
          DownPayment: 200000,
          InterestRate: 6.5,
          LoanTermMonths: 186, // 15.5 * 12
        } as IAffordabilityRequest,
      })
    );
  });
});
