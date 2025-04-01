interface ILoan{
    LoanId?: number;
    LoanAmount: number;
    InterestRate: number;
    LoanTermYears: number;
    ApplicationDate: string;
    ApprovalStatus: string;
}

export type {ILoan}