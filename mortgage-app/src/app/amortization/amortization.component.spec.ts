import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AmortizationComponent } from './amortization.component';
import {
  calculateAmortization,
  resetAmortization,
} from '../store/amortization/amortization.actions';
import {
  IAmortizationSchedule,
  IAmortizationRequest,
} from '../models/IAmortizationSchedule';
import { Chart } from 'chart.js';

describe('Amortization Component', () => {
  let component: AmortizationComponent;
  let fixture: ComponentFixture<AmortizationComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockStore.select.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AmortizationComponent,ReactiveFormsModule],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(AmortizationComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component.chart) {
      component.chart.destroy();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    component.ngOnInit();
    expect(component.amortizationForm.value).toEqual({
      LoanAmount: 500000,
      InterestRate: 7.5,
      LoanTermYears: 5,
    });
  });

  it('should dispatch calculateAmortization action on form submit', () => {
    component.ngOnInit();
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      calculateAmortization({
        request: component.amortizationForm.value as IAmortizationRequest,
      })
    );
  });

  it('should calculate summary correctly', () => {
    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        InterestPayment: 200,
        PrincipalPayment: 800,
        RemainingBalance: 9000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        InterestPayment: 180,
        PrincipalPayment: 820,
        RemainingBalance: 8180,
      },
    ];
    mockStore.select.and.returnValue(of(mockSchedule));
    component.ngOnInit();
    expect(component.totalInterest).toBe(380);
    expect(component.totalPayment).toBe(2000);
    expect(component.monthlyPayment).toBe(1000);
  });

  it('should handle empty schedule', () => {
    mockStore.select.and.returnValue(of([]));
    component.ngOnInit();
    expect(component.totalInterest).toBe(0);
    expect(component.totalPayment).toBe(0);
    expect(component.monthlyPayment).toBe(0);
  });

  it('should render chart when schedule is available', () => {
    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        InterestPayment: 200,
        PrincipalPayment: 800,
        RemainingBalance: 9000,
      },
    ];
    mockStore.select.and.returnValue(of(mockSchedule));
    spyOn(Chart, 'register');
    spyOn(Chart.prototype, 'destroy');
    component.ngOnInit();
    expect(Chart.register).toHaveBeenCalled();
    expect(component.chart).toBeDefined();
  });

  it('should load default amortization on init', () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      calculateAmortization({
        request: { LoanAmount: 500000, InterestRate: 7.5, LoanTermYears: 5 },
      })
    );
  });

  it('should unsubscribe and reset state on destroy', () => {
    component.ngOnInit();
    spyOn(component['scheduleSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['scheduleSubscription'].unsubscribe).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(resetAmortization());
  });



  it('should handle extremely large loan amounts', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ LoanAmount: 1000000000 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should handle zero interest rate', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ InterestRate: 0 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should handle maximum loan term', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ LoanTermYears: 30 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  // Additional edge cases
  it('should handle minimum loan amount', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ LoanAmount: 1 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should handle maximum interest rate', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ InterestRate: 100 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should handle minimum loan term', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ LoanTermYears: 1 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should handle fractional loan term years', () => {
    component.ngOnInit();
    component.amortizationForm.patchValue({ LoanTermYears: 2.5 });
    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});
