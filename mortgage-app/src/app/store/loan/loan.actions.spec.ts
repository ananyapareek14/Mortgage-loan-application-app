import { ILoan } from '../../models/ILoan';
import * as LoanActions from './loan.actions';

describe('Loan Actions', () => {
  // Sample loan data for testing
  const sampleLoan: ILoan = {
    LoanId: 1,
    UserLoanNumber: 12345,
    LoanAmount: 10000,
    InterestRate: 5.5,
    LoanTermYears: 3,
    ApplicationDate: '2023-05-01',
    ApprovalStatus: 'Approved',
  };

  const sampleLoans: ILoan[] = [
    sampleLoan,
    {
      LoanId: 2,
      UserLoanNumber: 67890,
      LoanAmount: 20000,
      InterestRate: 4.5,
      LoanTermYears: 4,
      ApplicationDate: '2023-05-02',
      ApprovalStatus: 'Pending',
    },
  ];

  describe('loadLoans', () => {
    it('should create an action to load loans', () => {
      const action = LoanActions.loadLoans();
      expect(action.type).toBe('[Loan] Load Loans');
    });
  });

  describe('loadLoansSuccess', () => {
    it('should create an action for successful loan loading', () => {
      const action = LoanActions.loadLoansSuccess({ loans: sampleLoans });
      expect(action.type).toBe('[Loan] Load Loans Success');
      expect(action.loans).toEqual(sampleLoans);
    });

    it('should handle an empty array of loans', () => {
      const action = LoanActions.loadLoansSuccess({ loans: [] });
      expect(action.type).toBe('[Loan] Load Loans Success');
      expect(action.loans).toEqual([]);
    });
  });

  describe('loadLoansFailure', () => {
    it('should create an action for loan loading failure', () => {
      const errorMessage = 'Failed to load loans';
      const action = LoanActions.loadLoansFailure({ error: errorMessage });
      expect(action.type).toBe('[Loan] Load Loans Failure');
      expect(action.error).toBe(errorMessage);
    });
  });

  describe('addLoan', () => {
    it('should create an action to add a loan', () => {
      const action = LoanActions.addLoan({ loan: sampleLoan });
      expect(action.type).toBe('[Loan] Add Loan');
      expect(action.loan).toEqual(sampleLoan);
    });
  });

  describe('addLoanSuccess', () => {
    it('should create an action for successful loan addition', () => {
      const action = LoanActions.addLoanSuccess({ loan: sampleLoan });
      expect(action.type).toBe('[Loan] Add Loan Success');
      expect(action.loan).toEqual(sampleLoan);
    });
  });

  describe('addLoanFailure', () => {
    it('should create an action for loan addition failure', () => {
      const errorMessage = 'Failed to add loan';
      const action = LoanActions.addLoanFailure({ error: errorMessage });
      expect(action.type).toBe('[Loan] Add Loan Failure');
      expect(action.error).toBe(errorMessage);
    });
  });

  describe('loadLoanById', () => {
    it('should create an action to load a loan by ID', () => {
      const userLoanNumber = 12345;
      const action = LoanActions.loadLoanById({ userLoanNumber });
      expect(action.type).toBe('[Loan] Load Loan By ID');
      expect(action.userLoanNumber).toBe(userLoanNumber);
    });

    it('should handle boundary values for userLoanNumber', () => {
      const minUserLoanNumber = 1;
      const maxUserLoanNumber = Number.MAX_SAFE_INTEGER;

      const minAction = LoanActions.loadLoanById({
        userLoanNumber: minUserLoanNumber,
      });
      expect(minAction.userLoanNumber).toBe(minUserLoanNumber);

      const maxAction = LoanActions.loadLoanById({
        userLoanNumber: maxUserLoanNumber,
      });
      expect(maxAction.userLoanNumber).toBe(maxUserLoanNumber);
    });
  });

  describe('loadLoanByIdSuccess', () => {
    it('should create an action for successful loan loading by ID', () => {
      const action = LoanActions.loadLoanByIdSuccess({ loan: sampleLoan });
      expect(action.type).toBe('[Loan] Load Loan By ID Success');
      expect(action.loan).toEqual(sampleLoan);
    });
  });

  describe('loadLoanByIdFailure', () => {
    it('should create an action for loan loading by ID failure', () => {
      const errorMessage = 'Failed to load loan by ID';
      const action = LoanActions.loadLoanByIdFailure({ error: errorMessage });
      expect(action.type).toBe('[Loan] Load Loan By ID Failure');
      expect(action.error).toBe(errorMessage);
    });
  });

  describe('clearLastAddedLoan', () => {
    it('should create an action to clear the last added loan', () => {
      const action = LoanActions.clearLastAddedLoan();
      expect(action.type).toBe('[Loan] Clear Last Added Loan');
    });
  });

  // Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined loan in addLoan action', () => {
      const action = LoanActions.addLoan({
        loan: undefined as unknown as ILoan,
      });
      expect(action.type).toBe('[Loan] Add Loan');
      expect(action.loan).toBeUndefined();
    });

    it('should handle undefined loans array in loadLoansSuccess action', () => {
      const action = LoanActions.loadLoansSuccess({
        loans: undefined as unknown as ILoan[],
      });
      expect(action.type).toBe('[Loan] Load Loans Success');
      expect(action.loans).toBeUndefined();
    });

    it('should handle invalid loan object in addLoan action', () => {
      const invalidLoan = { LoanId: 'invalid' } as unknown as ILoan;
      const action = LoanActions.addLoan({ loan: invalidLoan });
      expect(action.type).toBe('[Loan] Add Loan');
      expect(action.loan).toEqual(invalidLoan);
    });

    it('should handle empty error message in failure actions', () => {
      const action = LoanActions.loadLoansFailure({ error: '' });
      expect(action.type).toBe('[Loan] Load Loans Failure');
      expect(action.error).toBe('');
    });

    it('should handle extreme values for loan properties', () => {
      const extremeLoan: ILoan = {
        LoanId: Number.MAX_SAFE_INTEGER,
        UserLoanNumber: Number.MAX_SAFE_INTEGER,
        LoanAmount: Number.MAX_VALUE,
        InterestRate: 100,
        LoanTermYears: 100,
        ApplicationDate: '9999-12-31',
        ApprovalStatus: 'Extreme',
      };
      const action = LoanActions.addLoan({ loan: extremeLoan });
      expect(action.type).toBe('[Loan] Add Loan');
      expect(action.loan).toEqual(extremeLoan);
    });

    it('should handle negative values for numeric properties', () => {
      const negativeLoan: ILoan = {
        LoanId: -1,
        UserLoanNumber: -12345,
        LoanAmount: -10000,
        InterestRate: -5.5,
        LoanTermYears: -3,
        ApplicationDate: '2023-05-01',
        ApprovalStatus: 'Negative',
      };
      const action = LoanActions.addLoan({ loan: negativeLoan });
      expect(action.type).toBe('[Loan] Add Loan');
      expect(action.loan).toEqual(negativeLoan);
    });

    it('should handle invalid date format in ApplicationDate', () => {
      const invalidDateLoan: ILoan = {
        ...sampleLoan,
        ApplicationDate: 'Invalid Date',
      };
      const action = LoanActions.addLoan({ loan: invalidDateLoan });
      expect(action.type).toBe('[Loan] Add Loan');
      expect(action.loan).toEqual(invalidDateLoan);
    });
  });
});
