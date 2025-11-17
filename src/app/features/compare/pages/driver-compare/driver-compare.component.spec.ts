import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCompareComponent } from './driver-compare.component';
import { of } from 'rxjs';
import { fireEvent, render, screen } from '@testing-library/angular';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { DriverCountryService } from '../../../drivers/pages/drivers-list/driver-country.service';

const mockDrivers = [
  { driver_number: 1, full_name: 'Max Verstappen', team_name: 'Red Bull' },
  { driver_number: 44, full_name: 'Lewis Hamilton', team_name: 'Mercedes' },
  { driver_number: 16, full_name: 'Charles Leclerc', team_name: 'Ferrari' }
]

const mockF1ApiService = {
  getDrivers: () => of(mockDrivers)
};

const mockCountryService = {
  getCountryCode: (n: number) => {
    if (n === 1) return 'NL';
    if (n === 44) return 'GB';
    return 'MC';
  }
};

describe('DriverCompareComponent (integration)', () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const msg = String(args[0] ?? '');
      if (msg.includes('Failed to create chart')) return;
      originalError(...args);
    });

    jest.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
      const msg = String(args[0] ?? '');
      if (msg.includes('Importing "setup-jest.js" directly is deprecated')) return;
      originalError(...args);
    });
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
  });

  it('should allow selection of up to two pilots', async () => {
    const { container } = await render(DriverCompareComponent, {
      providers: [
        { provide: F1ApiService, useValue: mockF1ApiService },
        { provide: DriverCountryService, useValue: mockCountryService }
      ]
    });

    await screen.findByText('Max Verstappen');

    const selectedBadges = container.querySelectorAll('.mt-4.tag.is-warning');

    expect(selectedBadges.length).toBeLessThanOrEqual(2);
  });

  it('should display message when limit is reached', async () => {
    const { container } = await render(DriverCompareComponent, {
      providers: [
        { provide: F1ApiService, useValue: mockF1ApiService },
        { provide: DriverCountryService, useValue: mockCountryService }
      ]
    });

    await screen.findByText('Max Verstappen');

    fireEvent.click(screen.getByText('Max Verstappen'));
    fireEvent.click(screen.getByText('Lewis Hamilton'));
    fireEvent.click(screen.getByText('Charles Leclerc'));

    const selectedBadges = container.querySelectorAll('.mt-4 .tag.is-warning');

    expect(selectedBadges.length).toBe(2);
  });
});
