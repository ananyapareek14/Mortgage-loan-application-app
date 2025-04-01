import { ILoan } from '../../models/ILoan';

export interface LoanState {
  loans: ILoan[];
  selectedLoan: ILoan | null;
  loading: boolean;
  error: string | null;
}

export const initialState: LoanState = {
  loans: [],
  selectedLoan: null,
  loading: false,
  error: null,
};
