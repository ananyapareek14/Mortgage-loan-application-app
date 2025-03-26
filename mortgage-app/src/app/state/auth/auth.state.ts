export interface AuthState {
    username: string | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  export const initialAuthState: AuthState = {
    username: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!).username : null,
    token: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!).token : null,
    loading: false,
    error: null,
  };
  