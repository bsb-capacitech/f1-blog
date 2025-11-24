import 'jest-preset-angular/setup-env/zone';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';

setupZoneTestEnv();

jest.mock('@fortawesome/angular-fontawesome', () => {
  const { Component, Input } = require('@angular/core');

  @Component({
    selector: 'fa-icon',
    standalone: true,
    template: '<span></span>',
  })
  class FaIconComponentMock {
    @Input() icon: any;
  }

  return {
    FaIconComponent: FaIconComponentMock
  };
});

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('NG0303')) {
      return;
    };
  };
});

afterAll(() => {
  console.error = originalError;
});
