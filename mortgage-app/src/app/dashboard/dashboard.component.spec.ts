import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import * as LoanActions from '../store/loan/loan.actions';
import { ILoan } from '../models/ILoan';
import { selectLoans } from '../store/loan/loan.selectors';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Dashboard Component', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockLoans: ILoan[] = [
    {
      LoanId: 1,
      UserLoanNumber: 1,
      LoanAmount: 200000,
      InterestRate: 3.5,
      LoanTermYears: 30,
      ApplicationDate: '2024-01-01T00:00:00Z',
      ApprovalStatus: 'Pending',
    },
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, CommonModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectLoans,
              value: mockLoans,
            },
          ],
        }),
        provideAnimations(),
        CurrencyPipe,
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadLoans on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(LoanActions.loadLoans());
  });

  it('should call router.navigate with userLoanNumber on selectLoan()', () => {
    const loan: ILoan = mockLoans[0];
    component.selectLoan(loan);
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/dashboard',
      loan.UserLoanNumber,
    ]);
  });

  it('should not throw if UserLoanNumber is null', () => {
    const loan: ILoan = { ...mockLoans[0], UserLoanNumber: null as any };
    expect(() => component.selectLoan(loan)).not.toThrow();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard', 0]);
  });
});
