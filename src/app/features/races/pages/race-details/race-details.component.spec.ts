import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDetailsComponent } from './race-details.component';
import { of } from 'rxjs';
import { render } from '@testing-library/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { screen } from '@testing-library/dom';

class MockF1ApiService {
  getEndpoint = jest.fn().mockImplementation((url: string) => {
    if (url.includes('session_result')) return of([{ driver_number: 0, position: 1, number_of_laps: 10, dnf: false }]);
    if (url.includes('laps')) return of([{ driver_number: 0, lap_duration: 85000 }]);

    return of([]);
  })
  getDrivers = jest.fn().mockReturnValue(of([{ driver_number: 0, full_name: 'Test Driver', team_name: 'Test Team' }]));
  getSessions = jest.fn().mockReturnValue(of([{
      session_key: 123,
      session_name: 'GP Teste',
      country_code: 'BRA',
      country_name: 'Brasil',
      circuit_short_name: 'Interlagos',
      date_start: '2025-03-10T00:00:00Z', // mesmo ano mostrado no select
      meeting_key: 1234,
      session_type: 'Race',
      country_key: 10
  }]));
}

describe('RaceDetailsComponent - Roteamento', () => {
  it('should capture the sessionKey route parameter', async () => {
    await render(RaceDetailsComponent, {
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['sessionKey', '123']]) } } },
        { provide: F1ApiService, useValue: MockF1ApiService }
      ]
    });

    expect(screen.getAllByAltText(/corrida/i).length).toBeGreaterThan(0);
  });

  it('should execute navigation to call goBack()', async () => {
    const { fixture } = await render(RaceDetailsComponent, {
      imports: [RouterModule.forRoot([])],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: F1ApiService, useValue: MockF1ApiService }
      ]
    });

    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.componentInstance.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/races']);
  });
});

describe('RaceDetailsComponent - Estilos condicionais', () => {
  let fixture;
  let comp: RaceDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['sessionKey', '123']]) } } },
        { provide: F1ApiService, useValue: MockF1ApiService }
      ]
    });
    fixture = TestBed.createComponent(RaceDetailsComponent);
    comp = fixture.componentInstance;
  });

  it('should apply podium class for 1 at 3 positions', async () => {
    expect(comp.getRowClass({
      position: 1,
      driver_number: 0,
      full_name: '',
      team_name: '',
      laps_completed: 0,
      lap_time_best: 0,
      status: 'DNF'
    })).toHaveProperty('podium-first');
    expect(comp.getRowClass({
      position: 3,
      driver_number: 0,
      full_name: '',
      team_name: '',
      laps_completed: 0,
      lap_time_best: 0,
      status: 'DNF'
    })).toHaveProperty('podium-first');
  });

  it('should apply points class for top 10', async () => {
    expect(comp.getRowClass({
      position: 7,
      driver_number: 0,
      full_name: '',
      team_name: '',
      laps_completed: 0,
      lap_time_best: 0,
      status: 'DNF'
    })).toHaveProperty('points-position');
  });

  it('should apply best lap highlight', async () => {
    comp.results.set([{
      lap_time_best: 1,
      driver_number: 0,
      position: 4,
      full_name: '',
      team_name: '',
      laps_completed: 0,
      status: 'DNF'
    }]);

    expect(comp.getRowClass({
      position: 4,
      driver_number: 0,
      full_name: '',
      team_name: '',
      laps_completed: 0,
      lap_time_best: 1,
      status: 'DNF'
    })).toHaveProperty('best-lap');
  });

  it('no classes must be active', async () => {
    const result = comp.getRowClass({
      position: null,
      driver_number: 0,
      full_name: '',
      team_name: '',
      laps_completed: 0,
      lap_time_best: 0,
      status: 'DNF'
    });

    expect(Object.values(result).some(Boolean)).toBe(false);
  });
});
