import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthState } from '../../store/auth/auth.reducer';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // spy after injection

    // Mock selectors
    spyOn(store, 'select').and.callFake((selector: any) => {
      if (selector === AuthSelectors.selectAuthToken) {
        return of('mockToken');
      } else if (selector === AuthSelectors.selectAuthState) {
        return of({ username: 'john' } as AuthState);
      }
      return of(null);
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables on ngOnInit', (done) => {
    component.isLoggedIn$.subscribe((value) => {
      expect(value).toBeTrue();
    });

    component.username$.subscribe((value) => {
      expect(value).toBe('john');
      done();
    });
  });

  it('should dispatch logout and navigate to login on logout()', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(localStorage, 'removeItem');

    component.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth');
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
