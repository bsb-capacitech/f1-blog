import { Component } from "@angular/core";
import { provideRouter, RouterModule } from "@angular/router";
import { RacesListComponent } from "../pages/races-list/races-list.component";
import { RaceDetailsComponent } from "../pages/race-details/race-details.component";
import { of } from "rxjs";
import { MOCK_DRIVERS, MOCK_SESSIONS } from "../../../core/services/__mocks__/session-data.mock";
import { RaceStoreService } from "../services/race-store.service";
import { render, screen } from "@testing-library/angular";
import { F1ApiService } from "../../../core/services/f1-api.service";

const AppHost = Component({
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`
})(class {});

describe('Integation: Flow RacesList -> RaceDetails', () => {
  const routes = [
    { path: 'races', component: RacesListComponent },
    { path: 'races/:sessionKey', component: RaceDetailsComponent }
  ];

  const mockF1ApiService = {
    getSessions: () => of(MOCK_DRIVERS),
    getEndpoint: (_url: string) => of([]),
    getDrivers: () => of(MOCK_DRIVERS)
  }

  it('should navigate from list to details and maintain state via RaceStore', async () => {
    const sharedRaceStore = new RaceStoreService();
    sharedRaceStore.setRace(MOCK_SESSIONS[2]);

    const result = await render(AppHost, {
      providers: [
        provideRouter(routes),
        { provide: F1ApiService, useValue: mockF1ApiService },
        { provide: RaceStoreService, useValue: sharedRaceStore }
      ]
    });

    await result.navigate('/races');
    await screen.findByText(/Calendário de Corridas F1/i);

    await result.navigate('/races/3');

    const detailTitle = await screen.findByText(/Detalhes da Corrida/i);
    expect(detailTitle).toBeInTheDocument();
  });

  it('should display error if fails to load races', async () => {
    const { fixture } = await render(RacesListComponent, {
      providers: [
        provideRouter(routes),
        { provide: F1ApiService, useValue: mockF1ApiService },
        RaceStoreService
      ]
    });

    fixture.componentInstance.error.set('Erro ao carregar corridas');
    fixture.detectChanges();

    expect(await screen.findByText(/Erro ao carregar corridas/i)).toBeTruthy();
  });
});