import { TestBed } from '@angular/core/testing';
import { selectAuthState } from './auth.selectors';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('Auth Selectors', () => {
  let store: MockStore;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the auth state', () => {
    const mockAuthState = { token: 'mock-token', username: 'user', error: null, isLoading: false };
    store.setState({ auth: mockAuthState });

    store.select(selectAuthState).subscribe(state => {
      expect(state).toEqual(mockAuthState);
    });
  });
});
