import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { loanReducer } from './loan.reducer';
import * as LoanActions from './loan.actions';
import { ILoan } from '../../models/ILoan';
import { initialState, LoanState } from './loan.state';

describe('Loan Reducer', () => {
  let store: Store<LoanState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ loans: loanReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should return the initial state', () => {
    const action = { type: 'NOOP' } as any;
    const result = loanReducer(undefined, action);

    expect(result).toBe(initialState);
  });

  it('should set loading to true when loadLoans action is dispatched', () => {
    const action = LoanActions.loadLoans();
    const result = loanReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should update state with loans when loadLoansSuccess action is dispatched', () => {
    const loans: ILoan[] = [
      {
        UserLoanNumber: 1,
        LoanAmount: 1000,
        InterestRate: 5,
        LoanTermYears: 5,
        ApplicationDate: '2023-05-01',
        ApprovalStatus: 'Approved',
      },
      {
        UserLoanNumber: 2,
        LoanAmount: 2000,
        InterestRate: 6,
        LoanTermYears: 10,
        ApplicationDate: '2023-05-02',
        ApprovalStatus: 'Pending',
      },
    ];
    const action = LoanActions.loadLoansSuccess({ loans });
    const result = loanReducer(initialState, action);

    expect(result.loans).toEqual(loans);
    expect(result.loading).toBe(false);
  });

  it('should set error when loadLoansFailure action is dispatched', () => {
    const error = 'Error loading loans';
    const action = LoanActions.loadLoansFailure({ error });
    const result = loanReducer(initialState, action);

    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should set loading to true when addLoan action is dispatched', () => {
    const loan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: 1000,
      InterestRate: 5,
      LoanTermYears: 5,
      ApplicationDate: '2023-05-01',
      ApprovalStatus: 'Pending',
    };
    const action = LoanActions.addLoan({ loan });
    const result = loanReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should add loan to state when addLoanSuccess action is dispatched', () => {
    const loan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: 1000,
      InterestRate: 5,
      LoanTermYears: 5,
      ApplicationDate: '2023-05-01',
      ApprovalStatus: 'Approved',
    };
    const action = LoanActions.addLoanSuccess({ loan });
    const result = loanReducer(initialState, action);

    expect(result.loans).toContain(loan);
    expect(result.lastAddedLoan).toEqual(loan);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should set error when addLoanFailure action is dispatched', () => {
    const error = 'Error adding loan';
    const action = LoanActions.addLoanFailure({ error });
    const result = loanReducer(initialState, action);

    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should set loading to true when loadLoanById action is dispatched', () => {
    const action = LoanActions.loadLoanById({ userLoanNumber: 1 });
    const result = loanReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should update selectedLoan when loadLoanByIdSuccess action is dispatched', () => {
    const loan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: 1000,
      InterestRate: 5,
      LoanTermYears: 5,
      ApplicationDate: '2023-05-01',
      ApprovalStatus: 'Approved',
    };
    const action = LoanActions.loadLoanByIdSuccess({ loan });
    const result = loanReducer(initialState, action);

    expect(result.selectedLoan).toEqual(loan);
    expect(result.loading).toBe(false);
  });

  it('should set error and clear selectedLoan when loadLoanByIdFailure action is dispatched', () => {
    const error = 'Error loading loan';
    const action = LoanActions.loadLoanByIdFailure({ error });
    const result = loanReducer(initialState, action);

    expect(result.error).toBe(error);
    expect(result.selectedLoan).toBeNull();
    expect(result.loading).toBe(false);
  });

  it('should clear lastAddedLoan when clearLastAddedLoan action is dispatched', () => {
    const initialStateWithLastAddedLoan = {
      ...initialState,
      lastAddedLoan: {
        UserLoanNumber: 1,
        LoanAmount: 1000,
        InterestRate: 5,
        LoanTermYears: 5,
        ApplicationDate: '2023-05-01',
        ApprovalStatus: 'Approved',
      },
    };
    const action = LoanActions.clearLastAddedLoan();
    const result = loanReducer(initialStateWithLastAddedLoan, action);

    expect(result.lastAddedLoan).toBeNull();
  });

  // Edge case: Adding a loan when loans array is empty
  it('should add loan to empty loans array', () => {
    const loan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: 1000,
      InterestRate: 5,
      LoanTermYears: 5,
      ApplicationDate: '2023-05-01',
      ApprovalStatus: 'Pending',
    };
    const action = LoanActions.addLoanSuccess({ loan });
    const emptyState = { ...initialState, loans: [] };
    const result = loanReducer(emptyState, action);

    expect(result.loans).toEqual([loan]);
  });

  // Boundary condition: Adding a loan with maximum allowed amount
  it('should add loan with maximum allowed amount', () => {
    const maxLoan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: Number.MAX_SAFE_INTEGER,
      InterestRate: 100,
      LoanTermYears: 30,
      ApplicationDate: '2023-05-01',
      ApprovalStatus: 'Pending',
    };
    const action = LoanActions.addLoanSuccess({ loan: maxLoan });
    const result = loanReducer(initialState, action);

    expect(result.loans).toContain(maxLoan);
  });

  // Error handling: Attempting to load a non-existent loan
  it('should handle loading a non-existent loan', () => {
    const error = 'Loan not found';
    const action = LoanActions.loadLoanByIdFailure({ error });
    const result = loanReducer(initialState, action);

    expect(result.error).toBe(error);
    expect(result.selectedLoan).toBeNull();
  });

  // Edge case: Adding a loan with minimum allowed values
  it('should add loan with minimum allowed values', () => {
    const minLoan: ILoan = {
      UserLoanNumber: 0,
      LoanAmount: 0,
      InterestRate: 0,
      LoanTermYears: 0,
      ApplicationDate: '1970-01-01',
      ApprovalStatus: 'Rejected',
    };
    const action = LoanActions.addLoanSuccess({ loan: minLoan });
    const result = loanReducer(initialState, action);

    expect(result.loans).toContain(minLoan);
  });

  // Edge case: Handling a loan with an extremely long term
  it('should handle a loan with an extremely long term', () => {
    const longTermLoan: ILoan = {
      UserLoanNumber: 1,
      LoanAmount: 1000000,
      InterestRate: 1,
      LoanTermYears: 1000,
      ApplicationDate: '2023-05-01',
      ApprovalStatus: 'Approved',
    };
    const action = LoanActions.addLoanSuccess({ loan: longTermLoan });
    const result = loanReducer(initialState, action);

    expect(result.loans).toContain(longTermLoan);
  });
});
