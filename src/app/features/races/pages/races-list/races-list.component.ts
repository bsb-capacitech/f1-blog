import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { F1ApiService, Session } from '../../../../core/services/f1-api.service';
import { RaceCountryService } from './race-country.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-races-list',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title label has-text-warning">Calendário de Corridas F1</h1>

        <div class="field">
          <label class="label has-text-white">Filtrar por temporada:</label>
          <div class="control">
            <div class="select">
              <select [formControl]="seasonFilter">
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
        </div>

        @if(loading()){
          <div class="has-text-centered">
            <div class="loader"></div>
            <p class="has-text-white">Carregando corridas...</p>
          </div>
        } @else if (error()) {
          <div class="notification is-danger">{{ error() }}</div>
        } @else if (filteredRaces().length === 0) {
          <p class="has-text-light">Nenhuma corrida encontrada para o ano selecionado.</p>
        } @else {
          <div class="columns is-multiline">
            @for (race of filteredRaces(); track race.session_key) {
              <div class="column is-one-third">
                <div class="card f1-card">
                  <div class="card-content">
                    <p class="title is-4 has-text-warning">
                      <span>{{ race.country_code }}</span>
                      {{ race.country_name }}
                    </p>
                    <p class="subtitle is-6 has-text-light">
                      <i class="has-text-light">{{ race.circuit_short_name }}</i>
                      <span class="has-text-light"> • </span>
                      {{ race.date_start | date: 'dd/MMM' }}
                    </p>
                    <p class="has-text-light">{{ race.session_name }}</p>

                    <div class="has-text-right mt-3">
                      <span class="tag is-inf is-light">Ver detalhes -></span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .f1-card {
      background: linear-gradient(135deg, #1f1f27 0%, #15151e 100%);
      border: 1px solid #e10600;
      border-radius: 8px;
    }
    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #e10600;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }  
  `]
})
export class RacesListComponent implements OnInit {
  private f1ApiService = inject(F1ApiService);
  private countryService = inject(RaceCountryService);

  races = signal<Session[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  seasonFilter = new FormControl('2025');

  filteredRaces = computed(() => {
    const season = this.seasonFilter.value;
    return this.races().filter(race => race.date_start.includes(season || '2025'))
  });

  ngOnInit() {
    this.loadRace();
  }

  loadRace() {
    this.f1ApiService.getSessions().subscribe({
      next: (sessions) => {
        const raceSessions: Session[] = sessions.filter(session => session.session_type === 'Race');
        const enrichedSessions: Session[] = raceSessions.map(session => ({
          ...session,
          country_code: this.countryService.getCountryCode(session.country_key)
        }))
        this.races.set(enrichedSessions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar corridas: ', error);
        this.error.set('Erro ao carregar corridas. Tente novamente.');
        this.loading.set(false);
      }
    });
  }
}
