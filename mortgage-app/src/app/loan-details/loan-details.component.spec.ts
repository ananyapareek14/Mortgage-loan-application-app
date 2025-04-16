import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDetailsComponent } from './loan-details.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { loadLoanById } from '../store/loan/loan.actions';
import { loadAmortizationSchedule } from '../store/amortization/amortization.actions';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

describe('Loan Details Component', () => {
  let component: LoanDetailsComponent;
  let fixture: ComponentFixture<LoanDetailsComponent>;
  let store: jasmine.SpyObj<Store>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    const mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockStore.select.withArgs(jasmine.any(Function)).and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [LoanDetailsComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1', // Simulating userLoanNumber = 1
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    dispatchSpy = store.dispatch;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadLoanById and loadAmortizationSchedule on init', () => {
    // override the observable with mock data
    component['amortizationSchedule$'] = of(null);
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      loadLoanById({ userLoanNumber: 1 })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadAmortizationSchedule({ userLoanNumber: 1 })
    );
  });

  it('should calculate total interest, total payment and monthly payment correctly', () => {
    const schedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        InterestPayment: 300,
        PrincipalPayment: 700,
        RemainingBalance: 93000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        InterestPayment: 290,
        PrincipalPayment: 710,
        RemainingBalance: 92290,
      },
    ];

    component['calculateSummary'](schedule);

    expect(component.totalInterest).toBe(590);
    expect(component.totalPayment).toBe(2000);
    expect(component.monthlyPayment).toBe(1000);
  });

  it('should set the active tab correctly', () => {
    component.setActiveTab('bar-chart');
    expect(component.activeTab).toBe('bar-chart');
  });

  it('should call calculateSummary when schedule is emitted and not null', () => {
    const schedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        InterestPayment: 300,
        PrincipalPayment: 700,
        RemainingBalance: 93000,
      },
    ];

    // spy on calculateSummary
    const calcSpy = spyOn<any>(component, 'calculateSummary');

    component['amortizationSchedule$'] = of(schedule);
    component.ngOnInit();

    expect(calcSpy).toHaveBeenCalledWith(schedule);
  });

  it('should set monthlyPayment to 0 if schedule is empty', () => {
    component['calculateSummary']([]);
    expect(component.monthlyPayment).toBe(0);
  });

});
