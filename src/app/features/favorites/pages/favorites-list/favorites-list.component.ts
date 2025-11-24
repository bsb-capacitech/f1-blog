import { CommonModule } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoriteHeartComponent } from '../../../../shared/components/favorite-heart/favorite-heart.component';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-favorites-list',
  imports: [CommonModule, RouterModule, FavoriteHeartComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title has-text-warning has-text-centered">Meus Favoritos</h1>

        <!-- Abas -->
        <div class="tabs is-centered">
          <ul>
            <li [class.is-active]="activeTab() === 'drivers'">
              <a (click)="setActiveTab('drivers')">Pilotos</a>
            </li>
            <li [class.is-active]="activeTab() === 'races'">
              <a (click)="setActiveTab('races')">Corridas</a>
            </li>
          </ul>
        </div>

        <!-- Pilotos Favoritos -->
        @if (activeTab() === 'drivers') {
          <div class="content">
            <h2 class="subtitle has-text-light">Pilotos Favoritos</h2>
            
            @if (favoriteDriversData().length === 0) {
              <div class="has-text-centered py-6">
                <p class="has-text-light">Nenhum piloto favoritado ainda.</p>
                <a class="button is-warning mt-3" routerLink="/drivers">
                  Explorar Pilotos
                </a>
              </div>
            } @else {
              <div class="columns is-multiline">
                @for (driver of favoriteDriversData(); track driver.driver_number) {
                  <div class="column is-3-desktop is-6-tablet">
                    <div class="card f1-card has-text-centered">
                      <div class="card-header">
                        <app-favorite-heart 
                          [itemId]="driver.driver_number" 
                          [type]="'driver'">
                        </app-favorite-heart>
                      </div>
                      <div class="card-image">
                        <figure class="image is-128x128 is-inline-block">
                          <img [src]="driver.headshot_url" [alt]="driver.full_name" class="is-rounded">
                        </figure>
                      </div>
                      <div class="card-content">
                        <p class="title is-4 has-text-warning">{{ driver.full_name }}</p>
                        <p class="subtitle is-6 has-text-light">
                          #{{ driver.driver_number }} — {{ driver.team_name }}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Corridas Favoritas -->
        @if (activeTab() === 'races') {
          <div class="content">
            <h2 class="subtitle has-text-light">Corridas Favoritas</h2>
            
            @if (favoriteRacesData().length === 0) {
              <div class="has-text-centered py-6">
                <p class="has-text-light">Nenhuma corrida favoritada ainda.</p>
                <a class="button is-warning mt-3" routerLink="/races">
                  Explorar Corridas
                </a>
              </div>
            } @else {
              <div class="columns is-multiline">
                @for (race of favoriteRacesData(); track race.session_key) {
                  <div class="column is-one-third">
                    <div class="card f1-card">
                      <div class="card-header">
                        <app-favorite-heart 
                          [itemId]="race.session_key" 
                          [type]="'race'">
                        </app-favorite-heart>
                      </div>
                      <div class="card-content">
                        <p class="title is-4 has-text-warning">
                          {{ race.country_code}} • 
                          {{ race.circuit_short_name }}
                        </p>
                        <p class="subtitle is-6 has-text-light">
                          {{ race.date_start | date:'dd/MM/yy' }}
                        </p>
                        <a class="button is-info is-light is-small mt-3" [routerLink]="['/races', race.session_key]">
                          Ver Detalhes
                        </a>
                      </div>
                    </div>
                  </div>
                }
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
      transition: transform 0.2s ease;
    }
    .f1-card:hover {
      transform: translateY(-2px);
    }
    .tabs a {
      color: #fff;
      border-bottom-color: #e10600;
    }
    .tabs li.is-active a {
      color: #e10600;
      border-bottom-color: #e10600;
    }
  `]
})
export class FavoritesListComponent {
  private favoritesService = inject(FavoritesService);
  private f1ApiService = inject(F1ApiService);

  activeTab = signal<'drivers' | 'races'>('drivers');
  favoriteDriversData = signal<any[]>([]);
  favoriteRacesData = signal<any[]>([]);

  async ngOnInit() {
    await this.loadFavoriteData();
  };

  private async loadFavoriteData() {
    const { drivers, sessions } = await firstValueFrom(forkJoin({
      drivers: this.f1ApiService.getDrivers(),
      sessions: this.f1ApiService.getSessions()
    }));

    const favsDriverIds = this.favoritesService.favoriteDrivers();
    const favsRaceIds = this.favoritesService.favoriteRaces();

    this.favoriteDriversData.set(drivers.filter((driver: any) => favsDriverIds.includes(driver.driver_number)));
    this.favoriteRacesData.set(sessions.filter((session: any) => favsRaceIds.includes(session.session_key)));

  };

  setActiveTab(tab: 'drivers' | 'races'): void {
    this.activeTab.set(tab);
  };
}
