interface ILoan{
    LoanId?: number;
    UserLoanNumber: number;
    LoanAmount: number;
    InterestRate: number;
    LoanTermYears: number;
    ApplicationDate: string;
    ApprovalStatus: string;
}

export type {ILoan}