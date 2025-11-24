import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { HttpHandler, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BarController, BarElement, CategoryScale, Colors, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { cachingInterceptor } from './core/interceptors/caching.interceptor';

const cachingInterceptorFn : HttpInterceptorFn = (req, next) => {
  const handler = {
    handle: (r: any) => next(r)
  } as unknown as import('@angular/common/http').HttpHandler;

  return (cachingInterceptor as unknown as (req: any, next: import('@angular/common/http').HttpHandler) => any)(req, handler);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([cachingInterceptorFn])),
    provideCharts(withDefaultRegisterables(), {
      registerables: [
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend,
        Title,
        Colors
      ]
    })
  ]
};
