import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function generateCacheKey(req: HttpRequest<any>): string {
  return `${req.url}-${JSON.stringify(req.params.toString())}`;
};

function isCacheable(req: HttpRequest<any>): boolean {
  if (req.method !== 'GET') return false;

  const nonCacheableEndpoints = ['laps', 'session_result'];
  if (nonCacheableEndpoints.some(endpoint => req.url.includes(endpoint))) return false;

  return true;
};

function cleanupExpiredCache(): void {
  const now = Date.now();
  cache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_DURATION) cache.delete(key);
  });
};

export const cachingInterceptor = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
  cleanupExpiredCache();

  if (!isCacheable(req)) return next.handle(req);

  const cacheKey = generateCacheKey(req);
  const cachedEntry = cache.get(cacheKey);

  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION)) return of(new HttpResponse({ status: 200, body: cachedEntry.data }));

  return next.handle(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(cacheKey, {
          data: event.body,
          timestamp: Date.now()
        });
      };
    })
  );
};
