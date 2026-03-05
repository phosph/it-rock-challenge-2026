import { InjectionToken, Provider } from "@angular/core";
import type { FeedService } from "../../interfaces/feed-service.interface";
import { MockFeedServiceImpl } from "./mock-service/feed.service";

export const FEED_SERVICE = new InjectionToken<FeedService>("FEED_SERVICE");

export const provideMockFeedService = (): Provider => ({
  provide: FEED_SERVICE,
  useClass: MockFeedServiceImpl,
});
