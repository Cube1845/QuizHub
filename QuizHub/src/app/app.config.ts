import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { Preset } from './Preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NoopAnimationsModule),
    importProvidersFrom(BrowserAnimationsModule),
    providePrimeNG({
      theme: {
        preset: Preset,
        options: {
          darkModeSelector: '.my-app-dark',
          prefix: 'p',
        },
      },
    }),
  ],
};
