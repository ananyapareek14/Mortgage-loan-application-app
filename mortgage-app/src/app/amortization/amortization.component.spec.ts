import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmortizationComponent } from './amortization.component';
import { FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

describe('AmortizationComponent', () => {
  let component: AmortizationComponent;
  let fixture: ComponentFixture<AmortizationComponent>;
  let store: MockStore;

  const mockSchedule: IAmortizationSchedule[] = [
    { 
      PaymentNumber: 1,
      PaymentDate: new Date('2025-01-01'),
      MonthlyPayment: 1500,
      PrincipalPayment: 1005,
      InterestPayment: 495,
      RemainingBalance: 489000
    },
    { 
      PaymentNumber: 2,
      PaymentDate: new Date('2025-02-01'),
      MonthlyPayment: 1500,
      PrincipalPayment: 1010,
      InterestPayment: 490,
      RemainingBalance: 487990
    }
  ];

  const initialState = {
    amortization: {
      schedule: mockSchedule,
      loanDetails: {
        loanAmount: 500000,
        interestRate: 5,
        loanTermYears: 30
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmortizationComponent ],
      providers: [
        provideMockStore({ initialState }),
        FormBuilder
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // VERY important
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const formValue = component.amortizationForm.value;
    expect(formValue.loanAmount).toBe(500000);
    expect(formValue.interestRate).toBe(5);
    expect(formValue.loanTermYears).toBe(30);
  });

  it('should render form inputs', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should calculate summary correctly when schedule updates', () => {
    component.scheduleSubscription = mockSchedule;
    component.calculateSummary();

    expect(component.totalInterest).toBe(495 + 490); // 985
    expect(component.totalPayment).toBe(1500 * 2); // 3000
  });

  it('should destroy chart and subscription on ngOnDestroy', () => {
    const chartMock = { destroy: jasmine.createSpy('destroy') };
    const subscriptionMock = { unsubscribe: jasmine.createSpy('unsubscribe') };

    component.chart = chartMock as any;
    component.scheduleSubscription = subscriptionMock as any;

    component.ngOnDestroy();

    expect(chartMock.destroy).toHaveBeenCalled();
    expect(subscriptionMock.unsubscribe).toHaveBeenCalled();
  });

  it('should dispatch calculateAmortization on form submit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.amortizationForm.setValue({
      loanAmount: 400000,
      interestRate: 4.5,
      loanTermYears: 20
    });

    component.submitForm();

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
