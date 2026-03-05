import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthStore } from '@store/auth.store';
import { AUTH_SERVICE } from '@services/auth';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockAuthStore: { isAuthenticated: ReturnType<typeof vi.fn>; token: ReturnType<typeof vi.fn>; getCurrentUser: ReturnType<typeof vi.fn> };
  let router: Router;

  function setup(platformId = 'browser') {
    mockAuthStore = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      token: vi.fn().mockReturnValue(''),
      getCurrentUser: vi.fn().mockResolvedValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: AUTH_SERVICE, useValue: {} },
      ],
    });

    router = TestBed.inject(Router);
  }

  it('should return true on server (SSR)', async () => {
    setup('server');
    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should return true when user is authenticated', async () => {
    setup();
    mockAuthStore.isAuthenticated.mockReturnValue(true);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should return true when token exists and getCurrentUser succeeds', async () => {
    setup();
    mockAuthStore.token.mockReturnValue('valid-token');
    mockAuthStore.getCurrentUser.mockResolvedValue({ id: 'usr-001' });

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to /auth when token exists but getCurrentUser fails', async () => {
    setup();
    mockAuthStore.token.mockReturnValue('expired-token');
    mockAuthStore.getCurrentUser.mockResolvedValue(null);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/auth');
  });

  it('should redirect to /auth when not authenticated and no token', async () => {
    setup();

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/auth');
  });
});
