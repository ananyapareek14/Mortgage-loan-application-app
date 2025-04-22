import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { logout } from '../../store/auth/auth.actions';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent,RouterTestingModule],
      providers: [
        provideMockStore({
          initialState: { auth: { token: null, username: null } },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn$ and username$ observables', () => {
    component.ngOnInit();
    expect(component.isLoggedIn$).toBeDefined();
    expect(component.username$).toBeDefined();
  });

  it('should set isLoggedIn$ to true when token exists', (done) => {
    store.setState({ auth: { token: 'test-token', username: 'test-user' } });
    component.ngOnInit();
    component.isLoggedIn$.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBe(true);
      done();
    });
  });

  it('should set isLoggedIn$ to false when token does not exist', (done) => {
    store.setState({ auth: { token: null, username: null } });
    component.ngOnInit();
    component.isLoggedIn$.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBe(false);
      done();
    });
  });

  it('should set username$ correctly', (done) => {
    const testUsername = 'test-user';
    store.setState({ auth: { token: 'test-token', username: testUsername } });
    component.ngOnInit();
    component.username$.subscribe((username) => {
      expect(username).toBe(testUsername);
      done();
    });
  });

  it('should handle logout correctly', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const dispatchSpy = spyOn(store, 'dispatch');
    localStorage.setItem('auth', 'test-auth-data');

    component.logout();

    expect(localStorage.getItem('auth')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle logout when localStorage is empty', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const dispatchSpy = spyOn(store, 'dispatch');

    component.logout();

    expect(localStorage.getItem('auth')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle logout when localStorage throws an error', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(localStorage, 'removeItem').and.throwError('localStorage error');

    expect(() => component.logout()).not.toThrow();
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
