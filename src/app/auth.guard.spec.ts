import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard'; // Adjust the path as necessary
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;
  let mockRouterStateSnapshot: jasmine.SpyObj<RouterStateSnapshot>;

  beforeEach(() => {
    mockRouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', [
      'url',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  // Helper functions
  function mockTokenStorage(token: string | null) {
    spyOn(localStorage, 'getItem').and.returnValue(token);
    spyOn(sessionStorage, 'getItem').and.returnValue(token);
  }

  // Test case 1: Token exists
  it('should allow activation if token exists in localStorage', () => {
    mockTokenStorage('valid_token'); // Simulate a valid token in localStorage

    const result = authGuard.canActivate(new ActivatedRouteSnapshot(), mockRouterStateSnapshot);

    expect(result).toBeTrue(); // Expect to allow activation
    expect(router.navigate).not.toHaveBeenCalled(); // Ensure router navigation is not triggered
  });

  // Test case 2: No token, should redirect to login
  it('should not allow activation and redirect to login if no token exists', () => {
    mockTokenStorage(null); // Simulate no token

    const result = authGuard.canActivate(new ActivatedRouteSnapshot(), mockRouterStateSnapshot);

    expect(result).toBeFalse(); // Expect guard to block access
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Ensure redirection to login page
  });
});
