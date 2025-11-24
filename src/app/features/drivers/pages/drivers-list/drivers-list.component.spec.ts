import { DriverCountryService } from './driver-country.service';
import { delay, of } from 'rxjs';
import { fireEvent, render, screen } from '@testing-library/angular';
import { DriversListComponent } from '../../../drivers/pages/drivers-list/drivers-list.component';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryFlagPipe } from '../../../../shared/pipes/country-flag.pipe';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { F1ApiService } from '../../../../core/services/f1-api.service';

describe('DriversListComponent', () => {
  const mockF1ApiService = {
    getDrivers: jest.fn().mockReturnValue(of([]).pipe(delay(1)))
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading state initially', async () => {
    await render(DriversListComponent, {
      componentProperties: { isLoading: signal(true) },
      imports: [ReactiveFormsModule, CountryFlagPipe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DriverCountryService,
        { provide: F1ApiService, useValue: mockF1ApiService }
      ]
    })
    
    // expect(screen.getByText(/carregando pilotos/i)).toBeTruthy();
    const skeletons = screen.getAllByRole('skeleton');
    expect(skeletons.length).toBe(6);
  });

  it('should render driver cards after loading data', async () => {
    await render(DriversListComponent, {
      componentProperties: {
        drivers: signal([
          {
            full_name: 'Max Verstappen',
            country_name: 'Netherlands',
            team_name: 'Red Bull',
            driver_number: 1,
            name_acronym: 'VER',
            country_code: 'NED',
            headshot_url: 'url-to-image'
          }
        ]),
        isLoading: signal(false)
      },
      imports: [ReactiveFormsModule, CountryFlagPipe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DriverCountryService,
      ]
    });

    expect(screen.getByText('Max Verstappen')).toBeTruthy();
  });

  it('should filter drivers by team', async () => {
    const { fixture } = await render(DriversListComponent, {
      componentProperties: {
        drivers: signal([
          {
            full_name: 'Max Verstappen',
            team_name: 'Red Bull',
            driver_number: 1,
            name_acronym: 'VER',
            country_code: 'NED',
            headshot_url: ''
          },
          {
            full_name: 'Lewis Hamilton',
            team_name: 'Ferrari',
            driver_number: 44,
            name_acronym: 'HAM',
            country_code: 'GBR',
            headshot_url: ''
          },
        ]),
        isLoading: signal(false)
      },
      imports: [ReactiveFormsModule, CountryFlagPipe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DriverCountryService,
      ]
    });

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'Red Bull' } });
    fixture.detectChanges();

    expect(screen.queryByText('Max Verstappen')).toBeTruthy();
    expect(screen.queryByText('Lewis Hamilton')).toBeNull();
  });

  it('should return fallback URL when image does not exist', async () => {
    const { fixture } = await render(DriversListComponent, {
      imports: [ReactiveFormsModule, CountryFlagPipe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DriverCountryService,
      ]
    });

    const fallback = fixture.componentInstance.getFallbackImageUrl('Kimi ANTONELLI');

    expect(fallback).toContain('ANT');
  });

  it('should correctly generate the image URL for default name', async () => {
    const { fixture } = await render(DriversListComponent, {
      imports: [ReactiveFormsModule, CountryFlagPipe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DriverCountryService,
      ]
    });

    const url = fixture.componentInstance.getFallbackImageUrl('Max VERSTAPPEN');

    expect(url).toContain('Max_VERSTAPPEN');
  });
});
