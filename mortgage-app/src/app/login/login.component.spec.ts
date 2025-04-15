import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthState } from '../store/auth/auth.state';
import { login } from '../store/auth/auth.actions';
import {
  selectAuthError,
  selectAuthToken,
  selectIsLoading,
} from '../store/auth/auth.selectors';
import { of, Subject } from 'rxjs';

describe('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore<AuthState>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;
  const destroy$ = new Subject<void>();

  const initialState: AuthState = {
    isLoading: false,
    username: null,
    token: null,
    error: null,
  };

  beforeEach(async () => {
    toastr = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: ToastrService, useValue: toastr },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectAuthError, null);
    store.overrideSelector(selectAuthToken, null);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch login action when login() is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.credentials = { username: 'testuser', password: 'testpass' };
    component.login();
    expect(dispatchSpy).toHaveBeenCalledWith(
      login({ credentials: component.credentials })
    );
  });


  it('should show error and reset credentials on authError$', () => {
    store.overrideSelector(selectAuthError, 'Invalid credentials');
    store.refreshState(); // triggers new emissions

    component.ngOnInit(); // re-run init to subscribe
    expect(toastr.error).toHaveBeenCalledWith(
      'Invalid credentials',
      'Login Failed'
    );
    expect(component.credentials).toEqual({ username: '', password: '' });
  });

  it('should show success and navigate on authToken$', () => {
    store.overrideSelector(selectAuthToken, 'valid.token.here');
    store.refreshState(); // triggers new emissions

    component.ngOnInit(); // re-run init to subscribe
    expect(toastr.success).toHaveBeenCalledWith('Login successful!', 'Welcome');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    const nextSpy = spyOn(
      (component as any).destroy$,
      'next'
    ).and.callThrough();
    const completeSpy = spyOn(
      (component as any).destroy$,
      'complete'
    ).and.callThrough();

    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
