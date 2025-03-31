interface ILoan{
    LoanId: number;
    LoanAmount: number;
    InterestRate: number;
    LoanTermYears: number;
    ApplicationDate: string;
    ApplicationStatus: string;
}

export type {ILoan}