export interface AuthState {
  username: string | null;
  token: string | null;
  error: string | null;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  username: null,
  token: null,
  error: null,
  isLoading: false
};
