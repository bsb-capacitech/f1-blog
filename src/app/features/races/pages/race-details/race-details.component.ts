import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LapTimePipe } from '../../../../shared/pipes/lap-time.pipe';
import { F1ApiService, Driver } from '../../../../core/services/f1-api.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RaceStoreService } from '../../services/race-store.service';

interface DriverRaceResult {
  position: number | null;
  driver_number: number;
  full_name: string;
  team_name: string;
  laps_completed: number;
  lap_time_best: number;
  status: 'Finished' | 'DNF';
}

@Component({
  selector: 'app-race-details',
  imports: [CommonModule, RouterModule, LapTimePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a routerLink="/races" class="has-text-warning">Corridas</a></li>
            <li class="is-active"><a aria-current="page">Detalhes</a></li>
          </ul>
        </nav>

        <h1 class="title has-text-warning has-text-centered">Detalhes da Corrida</h1>
        <h3 class="subtitle has-text-light has-text-centered">
          {{ raceInfo()?.session_name }} •
          <i>{{ raceInfo()?.country_code }} - {{ raceInfo()?.circuit_short_name }}</i>
          ({{ raceInfo()?.date_start | date:'mediumDate' }})
        </h3>

        <span class="best-lap">*Volta mais rápida</span>

        @if (isLoading()) {
          <div class="has-text-centered mt-6">
            <div class="loader"></div>
            <p class="has-text-light">Carregando dados...</p>
          </div>
        } @else if (error()) {
          <div class="notification is-danger has-text-centered">{{ error() }}</div>
        } @else {
          <div class="table-container">
            <table class="table is-striped is-hoverable is-fullwidth has-text-centered mt-5">
              <thead>
                <tr>
                  <th class="is-hidden-mobile">Posição</th>
                  <th>Piloto</th>
                  <th class="is-hidden-touch">Equipe</th>
                  <th class="is-hidden-mobile">Voltas</th>
                  <th>Melhor Volta</th>
                  <th class="is-hidden-mobile">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (result of results(); track result.driver_number) {
                  <tr [ngClass]="getRowClass(result)">
                    <td class="is-hidden-mobile">
                      @switch (result.position) {
                        @case (1) {<span>🏆 </span><strong>{{ result.position }}</strong>}
                        @case (2) {<span>🥈 </span><strong>{{ result.position }}</strong>}
                        @case (3) {<span>🥉 </span><strong>{{ result.position }}</strong>}
                        @default {<strong>{{ result.position }}</strong>}
                      }
                    </td>
                    <td>
                      <div class="driver-info-mobile is-flex is-align-items-center">
                        <span class="position-mobile is-hidden-tablet mr-2">
                          {{ result.position }}
                        </span>
                        {{ result.full_name }}
                      </div>
                      <div class="is-hidden-tablet has-text-grey-light is-size-7">
                        {{ result.team_name }} • {{ result.laps_completed }} voltas
                      </div>
                    </td>
                    <td class="is-hidden-touch">{{ result.team_name }}</td>
                    <td class="is-hidden-mobile">{{ result.laps_completed }}</td>
                    <td>{{ result.lap_time_best | lapTime }}</td>
                    <td class="is-hidden-mobile">{{ result.status }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Conteúdo será implementado nos próximos passos -->
        <div class="has-text-centered mt-5">
          <button class="button is-warning" (click)="goBack()">← Voltar</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .loader {
      border: 4px solid #333;
      border-top: 4px solid #e10600;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: auto;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .points-position { background-color: rgba(52, 152, 219, 0.15) !important; }
    .podium-first { background-color: rgba(46, 204, 113, 0.2) !important; }
    .best-lap { background-color: rgba(241, 196, 15, 0.2) !important; }
    .table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .driver-info-mobile {
      min-height: 40px;
    }
    .position-mobile {
      background: #e10600;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
    }
    @media (max-width: 768px) {
      .table {
        font-size: 0.875rem;
      }
    }
  `]
})
export class RaceDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private f1Api = inject(F1ApiService);
  private raceStore = inject(RaceStoreService);

  sessionKey = signal<string | null>(null);
  results = signal<DriverRaceResult[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  bestRaceLap = computed(() => {
    const laps = this.results().map(race => race.lap_time_best).filter(time => time > 0);
    return laps.length ? Math.min(...laps) : null;
  });
  raceInfo = computed(() => this.raceStore.selectedRace());

  ngOnInit() {
    this.sessionKey.set(this.route.snapshot.paramMap.get('sessionKey'));
    this.loadRaceData();
  }

  private loadRaceData() {
    this.isLoading.set(true);

    forkJoin({
      session_result: this.f1Api.getEndpoint<any>(`session_result?session_key=${this.sessionKey()}`),
      laps: this.f1Api.getEndpoint<any>(`laps?session_key=${this.sessionKey()}`),
      drivers: this.f1Api.getDrivers()
    }).pipe(
      map(({ session_result, laps, drivers }: { session_result: any, laps: any, drivers: Driver[] }) => {
        const bestLapByDriver = laps.reduce((acc: any, lap: any) => {
          const existing = acc[lap.driver_number];
          if (!existing || lap.lap_duration < existing) {
            acc[lap.driver_number] = lap.lap_duration;
          }
          return acc;
        }, {} as Record<number, number>);

        const driverInfoMap = drivers.reduce((acc, driver) => {
          acc[driver.driver_number] = {
            full_name: driver.full_name,
            team_name: driver.team_name
          };
          return acc;
        }, {} as Record<number, { full_name: string; team_name: string }>);

        const combinedResults: DriverRaceResult[] = session_result.map((res: { driver_number: any; position: any; number_of_laps: any; dnf: any; }) => {
          const driverNum = res.driver_number;
          const bestLap = bestLapByDriver[driverNum] ?? 0;
          const driverInfo = driverInfoMap[driverNum] ?? { full_name: 'Jack DOOHAN', team_name: 'Alpine' };

          return {
            position: res.position,
            driver_number: driverNum,
            full_name: driverInfo.full_name,
            team_name: driverInfo.team_name,
            laps_completed: res.number_of_laps,
            lap_time_best: bestLap,
            status: res.dnf ? 'DNF' : 'Finished'
          };
        });

        combinedResults.sort((a, b) => {
          if (a.position != null && b.position != null) {
            return a.position - b.position;
          }
          if (a.position == null && b.position != null) return 1;
          if (a.position != null && b.position == null) return -1;

          if (b.laps_completed !== a.laps_completed) {
            return b.laps_completed - a.laps_completed;
          }

          return a.driver_number - b.driver_number;
        });

        return combinedResults;
      }),
      catchError(err => {
        console.error(err);
        this.error.set('Erro ao carregar dados da corrida.');
        this.isLoading.set(false);
        return of([]);
      })
    ).subscribe((driverRaceResult: DriverRaceResult[]) => {
      this.results.set(driverRaceResult);
      this.isLoading.set(false);
    });
  }

  goBack() {
    this.router.navigate(['/races']);
  }

  getRowClass(result: DriverRaceResult) {
    return {
      // 'podium-first': result.position <= 3 && result.position !== null,
      'podium-first': result.position! <= 3 && result.position !== null,
      // 'points-position': result.position <= 10 && result.position !== null,
      'points-position': result.position! <= 10 && result.position !== null,
      'best-lap': result.lap_time_best === this.bestRaceLap(),
    };
  }
}
