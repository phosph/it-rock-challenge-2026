import { InjectionToken, Provider } from "@angular/core";
import type { AuthService } from "../../interfaces/auth-service.interface";
import { MockAuthServiceImpl } from "./auth.service";

export const AUTH_SERVICE = new InjectionToken<AuthService>("AUTH_SERVICE")

export const provideMockAuthService = (): Provider => ({
  provide: AUTH_SERVICE,
  useClass: MockAuthServiceImpl
})
