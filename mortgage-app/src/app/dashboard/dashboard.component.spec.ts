import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from './dashboard.component';
import { ILoan } from '../models/ILoan';
import * as LoanActions from '../store/loan/loan.actions';
import { selectLoans } from '../store/loan/loan.selectors';
import { Router } from '@angular/router';

describe('Dashboard Component', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockStore: MockStore;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent,RouterTestingModule],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    mockStore = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadLoans action on ngOnInit', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(LoanActions.loadLoans());
  });

  it('should select loans from store', (done) => {
    const mockLoans: ILoan[] = [
      {
        UserLoanNumber: 1,
        LoanAmount: 1000,
        InterestRate: 5,
        LoanTermYears: 5,
        ApplicationDate: '2023-01-01',
        ApprovalStatus: 'Approved',
      },
      {
        UserLoanNumber: 2,
        LoanAmount: 2000,
        InterestRate: 6,
        LoanTermYears: 10,
        ApplicationDate: '2023-02-01',
        ApprovalStatus: 'Pending',
      },
    ];
    mockStore.overrideSelector(selectLoans, mockLoans);

    component.loans$.subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
      done();
    });
  });

  it('should navigate to loan detail when selectLoan is called with valid loan', () => {
    const mockLoan: ILoan = {
      UserLoanNumber: 123,
      LoanAmount: 5000,
      InterestRate: 7,
      LoanTermYears: 15,
      ApplicationDate: '2023-03-01',
      ApprovalStatus: 'Approved',
    };
    component.selectLoan(mockLoan);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard', 123]);
  });

  it('should navigate to loan detail with 0 when selectLoan is called with loan without UserLoanNumber', () => {
    const mockLoan: ILoan = {
      UserLoanNumber: 0,
      LoanAmount: 5000,
      InterestRate: 7,
      LoanTermYears: 15,
      ApplicationDate: '2023-03-01',
      ApprovalStatus: 'Approved',
    };
    component.selectLoan(mockLoan);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard', 0]);
  });

  it('should handle empty loan array', (done) => {
    mockStore.overrideSelector(selectLoans, []);

    component.loans$.subscribe((loans) => {
      expect(loans).toEqual([]);
      done();
    });
  });

//   it('should handle null loan array', (done) => {
//     mockStore.overrideSelector(selectLoans, null);

//     component.loans$.subscribe((loans) => {
//       expect(loans).toBeNull();
//       done();
//     });
//   });

//   it('should handle error when selecting loans', (done) => {
//     mockStore.overrideSelector(selectLoans, () => {
//       throw new Error('Test error');
//     });

//     component.loans$.subscribe(
//       () => {
//         fail('Should have thrown an error');
//       },
//       (error) => {
//         expect(error).toBeTruthy();
//         expect(error.message).toBe('Test error');
//         done();
//       }
//     );
//   });

  it('should handle large number of loans', (done) => {
    const largeLoansArray: ILoan[] = Array(1000)
      .fill(null)
      .map((_, index) => ({
        UserLoanNumber: index + 1,
        LoanAmount: (index + 1) * 1000,
        InterestRate: 5 + (index % 5),
        LoanTermYears: 5 + (index % 25),
        ApplicationDate: `2023-${String((index % 12) + 1).padStart(2, '0')}-01`,
        ApprovalStatus: index % 2 === 0 ? 'Approved' : 'Pending',
      }));
    mockStore.overrideSelector(selectLoans, largeLoansArray);

    component.loans$.subscribe((loans) => {
      expect(loans.length).toBe(1000);
      expect(loans[999].UserLoanNumber).toBe(1000);
      done();
    });
  });

  // Edge cases
  it('should handle loan with minimum values', (done) => {
    const minLoan: ILoan = {
      UserLoanNumber: 0,
      LoanAmount: 0,
      InterestRate: 0,
      LoanTermYears: 0,
      ApplicationDate: '1970-01-01',
      ApprovalStatus: '',
    };
    mockStore.overrideSelector(selectLoans, [minLoan]);

    component.loans$.subscribe((loans) => {
      expect(loans[0]).toEqual(minLoan);
      done();
    });
  });

  it('should handle loan with maximum values', (done) => {
    const maxLoan: ILoan = {
      UserLoanNumber: Number.MAX_SAFE_INTEGER,
      LoanAmount: Number.MAX_VALUE,
      InterestRate: 100,
      LoanTermYears: 100,
      ApplicationDate: '9999-12-31',
      ApprovalStatus: 'A'.repeat(255), // Assuming a max length of 255 for ApprovalStatus
    };
    mockStore.overrideSelector(selectLoans, [maxLoan]);

    component.loans$.subscribe((loans) => {
      expect(loans[0]).toEqual(maxLoan);
      done();
    });
  });

  it('should handle loan with special characters in ApprovalStatus', (done) => {
    const specialLoan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: 1000,
      InterestRate: 5,
      LoanTermYears: 5,
      ApplicationDate: '2023-01-01',
      ApprovalStatus: '!@#$%^&*()_+',
    };
    mockStore.overrideSelector(selectLoans, [specialLoan]);

    component.loans$.subscribe((loans) => {
      expect(loans[0]).toEqual(specialLoan);
      done();
    });
  });
});
