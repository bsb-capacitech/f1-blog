import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesListComponent } from './favorites-list.component';
import { of } from 'rxjs';
import { fireEvent, render, screen } from '@testing-library/angular';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { F1ApiService } from '../../../../core/services/f1-api.service';

describe('FavoritesListComponent (integration)', () => {
  const mockF1Api = {
    getDrivers: jest.fn(() => of([
      { driver_number: 1, full_name: 'Driver 1', headshot_url: 'x', team_name: 'Team A' }
    ])),
    getSessions: jest.fn(() => of([
      { session_key: 101, country_code: 'BR', circuit_short_name: 'Interlagos', date_start: new Date() }
    ])),
  };

  it('should show the list of drivers and races favorites', async () => {
    const { fixture } = await render(FavoritesListComponent, {
      providers: [
        {
          provide: FavoritesService,
          useFactory: () => {
            const service = new FavoritesService();
            service.toggleDriver(1);
            service.toggleRace(101);
            return service;
          }
        },
        { provide: F1ApiService, useValue: mockF1Api }
      ]
    });

    expect(screen.getByText(/pilotos favoritos/i)).toBeTruthy();
    
    const racesTab = screen.getByText(/corridas/i);
    fireEvent.click(racesTab);
    fixture.detectChanges();

    expect(await screen.findByText(/corridas favoritas/i)).toBeTruthy();
    expect(await screen.findByText(/interlagos/i)).toBeTruthy();

    screen.getByText(/pilotos/i).click();
    fixture.detectChanges();
    expect(screen.getByText(/driver 1/i)).toBeTruthy();
  });

  it("should show empty state message when don't have favorites", async () => {
    await render(FavoritesListComponent, {
      providers: [
        FavoritesService,
        { provide: F1ApiService, useValue: mockF1Api }
      ]
    });

    expect(screen.getByText(/nenhum piloto favoritado ainda/i)).toBeTruthy();
  });
});
