import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BarController, BarElement, CategoryScale, Colors, Legend, LinearScale, Title, Tooltip } from 'chart.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
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
