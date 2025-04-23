import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { loginSuccess } from './store/auth/auth.actions';

describe('App Component', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;
  let router: Router;
  let routerEvents: BehaviorSubject<any>;

  beforeEach(async () => {
    routerEvents = new BehaviorSubject<any>(null);

    await TestBed.configureTestingModule({
      imports: [AppComponent,RouterTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial values', () => {
    expect(component.title).toBe('mortgage-app');
    expect(component.hideNavbar).toBeFalsy();
    expect(component.isAuthReady).toBeFalsy();
  });

  it('should hide navbar when navigating to login page', () => {
    routerEvents.next(new NavigationEnd(1, '/login', '/login'));
    expect(component.hideNavbar).toBeTruthy();
  });

  it('should show navbar when navigating to non-login page', () => {
    routerEvents.next(new NavigationEnd(1, '/home', '/home'));
    expect(component.hideNavbar).toBeFalsy();
  });

  it('should dispatch loginSuccess action if auth data exists in localStorage', fakeAsync(() => {
    const authData = { token: 'testToken', username: 'testUser' };
    localStorage.setItem('auth', JSON.stringify(authData));

    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    tick();

    expect(dispatchSpy).toHaveBeenCalledWith(loginSuccess(authData));
  }));

  it('should not dispatch loginSuccess action if auth data does not exist in localStorage', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    tick();

    expect(dispatchSpy).not.toHaveBeenCalled();
  }));

  it('should set isAuthReady to true after a short delay', fakeAsync(() => {
    component.ngOnInit();
    expect(component.isAuthReady).toBeFalsy();

    tick();
    expect(component.isAuthReady).toBeTruthy();
  }));

  it('should handle malformed auth data in localStorage', fakeAsync(() => {
    localStorage.setItem('auth', 'invalid-json');

    const dispatchSpy = spyOn(store, 'dispatch');
    const consoleSpy = spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  }));

  it('should return correct animation data from getRouteAnimationData', () => {
    const mockOutlet: any = {
      activatedRouteData: {
        animation: 'testAnimation',
      },
    };

    expect(component.getRouteAnimationData(mockOutlet)).toBe('testAnimation');
  });

  it('should return undefined when no animation data is present', () => {
    const mockOutlet: any = {
      activatedRouteData: {},
    };

    expect(component.getRouteAnimationData(mockOutlet)).toBeUndefined();
  });
});
