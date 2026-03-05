import { InjectionToken, Provider } from "@angular/core";
import type { FeedService } from "@interfaces/feed-service.interface";
import { MockFeedServiceImpl } from "./mock-service/feed.service";

/** Injection token for the {@link FeedService} abstraction. */
export const FEED_SERVICE = new InjectionToken<FeedService>("FEED_SERVICE");

/** Provides {@link MockFeedServiceImpl} as the {@link FeedService} implementation. */
export const provideMockFeedService = (): Provider => ({
  provide: FEED_SERVICE,
  useClass: MockFeedServiceImpl,
});
