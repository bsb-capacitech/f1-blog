import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { cachingInterceptor, cache } from './caching.interceptor';
import { firstValueFrom, of } from 'rxjs';

describe('cachingInterceptor', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('should cache response ande reuse it within the valid period', async () => {
    const request = new HttpRequest('GET', '/api/sessions');
    const handlerFn: HttpHandlerFn = jest.fn(() => of(new HttpResponse({ body: [{ id: 1 }] })));
    const handler: HttpHandlerFn = handlerFn;

    const firstCall = await firstValueFrom(cachingInterceptor(request, handler));
    expect((firstCall as HttpResponse<any>).body).toEqual([{ id: 1 }]);
    expect(handlerFn).toHaveBeenCalledTimes(1);

    const secondCall = await firstValueFrom(cachingInterceptor(request, handler));
    expect((secondCall as HttpResponse<any>).body).toEqual([{ id: 1 }]);
    expect(handlerFn).toHaveBeenCalledTimes(1);
  });

  it('should ignore cache for dynamic endpoints (laps, results)', async () => {
    const request = new HttpRequest('GET', '/api/laps');
    const handlerFn: HttpHandlerFn = jest.fn(() => of(new HttpResponse({ body: [{ lap: 1 }] })));
    const handler: HttpHandlerFn = handlerFn;

    await firstValueFrom(cachingInterceptor(request, handler));
    expect(handlerFn).toHaveBeenCalledTimes(1);
  });

  it('should invalidate cache after expiration', async () => {
    jest.useFakeTimers();

    const request = new HttpRequest('GET', '/api/sessions');
    const handlerFn: HttpHandlerFn = jest.fn(() => of(new HttpResponse({ body: [{ id: 2 }] })));
    const handler: HttpHandlerFn = handlerFn;

    await firstValueFrom(cachingInterceptor(request, handler) as any);
    jest.advanceTimersByTime(5 * 60 * 1000 + 1);

    await firstValueFrom(cachingInterceptor(request, handler) as any);
    expect(handlerFn).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
