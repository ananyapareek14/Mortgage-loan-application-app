import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmortizationComponent } from './amortization.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  calculateAmortization,
  resetAmortization,
} from '../../store/amortization/amortization.actions';
import { IAmortizationSchedule } from '../../models/IAmortizationSchedule';
import { Router } from '@angular/router';
import { selectAmortizationSchedule } from '../../store/amortization/amortization.selectors';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Amortization Component', () => {
  let component: AmortizationComponent;
  let fixture: ComponentFixture<AmortizationComponent>;
  let store: MockStore;

  const mockSchedule: IAmortizationSchedule[] = [
    {
      PaymentNumber: 1,
      PaymentDate: new Date(),
      MonthlyPayment: 10000,
      PrincipalPayment: 8000,
      InterestPayment: 2000,
      RemainingBalance: 490000,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortizationComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAmortizationSchedule,
              value: mockSchedule,
            },
          ],
        }),
        provideAnimations(),
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AmortizationComponent);
    component = fixture.componentInstance;

    // Provide a dummy canvas for Chart.js
    const canvas = document.createElement('canvas');
    canvas.id = 'pieChart';
    document.body.appendChild(canvas);

    fixture.detectChanges(); // trigger ngOnInit
  });

  afterEach(() => {
    const canvas = document.getElementById('pieChart');
    if (canvas) {
      canvas.remove();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.amortizationForm.value).toEqual({
      LoanAmount: 500000,
      InterestRate: 7.5,
      LoanTermYears: 5,
    });
  });

  it('should dispatch calculateAmortization on submit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.amortizationForm.setValue({
      LoanAmount: 600000,
      InterestRate: 6.5,
      LoanTermYears: 10,
    });

    component.submitForm();

    expect(dispatchSpy).toHaveBeenCalledWith(
      calculateAmortization({ request: component.amortizationForm.value })
    );
  });

  it('should calculate summary from schedule', () => {
    component['calculateSummary'](mockSchedule);

    expect(component.totalInterest).toBe(2000);
    expect(component.totalPayment).toBe(10000);
    expect(component.monthlyPayment).toBe(10000);
  });

  it('should render a chart', () => {
    component.totalInterest = 2000;
    component.amortizationForm.setValue({
      LoanAmount: 500000,
      InterestRate: 7.5,
      LoanTermYears: 5,
    });

    component['renderChart']();

    expect(component.chart).toBeTruthy();
    expect(component.chart.config.data?.datasets?.[0]?.data).toEqual([
      500000, 2000,
    ]);
  });

  it('should dispatch resetAmortization on destroy', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(resetAmortization());
  });

  it('should unsubscribe from schedule on destroy', () => {
    const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.scheduleSubscription = subSpy;
    component.ngOnDestroy();
    expect(subSpy.unsubscribe).toHaveBeenCalled();
  });
});
