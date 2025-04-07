import { ILoan } from '../../models/ILoan';

export interface LoanState {
  loans: ILoan[];
  lastAddedLoan: ILoan | null;
  selectedLoan: ILoan | null;
  loading: boolean;
  error: string | null;
}

export const initialState: LoanState = {
  loans: [],
  lastAddedLoan: null,
  selectedLoan: null,
  loading: false,
  error: null,
};
