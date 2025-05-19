interface IAffordability {
    MaxAffordableHomePrice: number;
    EstimatedLoanAmount: number;
    EstimatedMonthlyPayment: number;
    DtiPercentage: number;
    AnnualIncome: number;
    DownPayment: number;
    LoanTermMonths: number;
    InterestRate: number;
    MonthlyDebts: number;
}

interface IAffordabilityRequest {
    AnnualIncome: number;
    DownPayment: number;
    LoanTermMonths: number;
    InterestRate: number;
    MonthlyDebts: number;
}

export type { IAffordability, IAffordabilityRequest };