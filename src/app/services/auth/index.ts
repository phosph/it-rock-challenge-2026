import { InjectionToken, Provider } from "@angular/core";
import type { AuthService } from "../../interfaces/auth-service.interface";
import { MockAuthServiceImpl } from "./auth.service";

/** Injection token for the {@link AuthService} abstraction. */
export const AUTH_SERVICE = new InjectionToken<AuthService>("AUTH_SERVICE");

/** Provides {@link MockAuthServiceImpl} as the {@link AuthService} implementation. */
export const provideMockAuthService = (): Provider => ({
  provide: AUTH_SERVICE,
  useClass: MockAuthServiceImpl,
});
