import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryFlagPipe } from '../../../../shared/pipes/country-flag.pipe';
import { F1ApiService, Driver } from '../../../../core/services/f1-api.service';
import { DriverCountryService } from './driver-country.service';
import { FavoriteHeartComponent } from '../../../../shared/components/favorite-heart/favorite-heart.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-drivers-list',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CountryFlagPipe, FavoriteHeartComponent, LoadingSkeletonComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title has-text-warning has-text-centered">Pilotos da Fórmula 1</h1>

        <div class="field">
          <label class="label has-text-white">Filtrar por equipe:</label>
          <div class="control">
            <div class="select">
              <select [formControl]="teamFilter">
                <option value="">Todas as equipes</option>
                @for (team of teams(); track team) {
                  <option [value]="team">{{ team }}</option>
                }             
              </select>
            </div>
          </div>
        </div>

        @if (isLoading()) {
          <div class="columns is-multiline">
            @for (item of [1,2,3,4,5,6]; track item) {
              <div class="column is-3-desktop is-6-tablet">
                <app-loading-skeleton type="card"></app-loading-skeleton>
              </div>
            }
          </div>
        } @else if (error()) {
          <div class="notification is-danger has-text-centered">{{ error() }}</div>
        } @else {
          <div class="columns is-multiline mt-5">
            @for (driver of filteredDrivers(); track driver.driver_number) {
              <div class="column is-3-desktop is-6-tablet">
                <div class="card f1-card has-text-centered">
                  <div class="card-header">
                    <app-favorite-heart 
                      [itemId]="driver.driver_number" 
                      [type]="'driver'"
                      (favoriteToggled)="onFavoriteToggled($event)">
                    </app-favorite-heart>
                  </div>
                  <div class="card-image">
                    <figure class="image is-128x128 is-inline-block">
                    <img [src]="getFallbackImageUrl(driver.full_name) || driver.headshot_url"
                          [alt]="driver.full_name"
                          class="is-rounded" />
                    </figure>
                  </div>
                  <div class="card-content">
                    <p class="title is-5 has-text-warning">{{ driver.full_name }}</p>
                    <p class="subtitle is-6 has-text-light">
                      #{{ driver.driver_number }} — {{ driver.team_name }}
                    </p>
                    <p>{{ driver.country_code | countryFlag }}</p>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (filteredDrivers().length === 0) {
            <p class="has-text-centered has-text-light mt-4">
              Nenhum piloto encontrado para a equipe selecionada.
            </p>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .f1-card {
      background: linear-gradient(135deg, #1f1f27 0%, #15151e 100%);
      border: 1px solid #333;
      border-radius: 10px;
      transition: transform 0.2s ease-in-out;
    }
    .f1-card:hover {
      transform: scale(1.03);
      box-shadow: 0 0 15px #e10600;
    }
    .loader {
      border: 4px solid #333;
      border-top: 4px solid #e10600;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .is-rounded {
      border-radius: 50%;
      object-fit: cover;
    }
  `]
})
export class DriversListComponent implements OnInit {
  private f1ApiService = inject(F1ApiService);
  private countryService = inject(DriverCountryService);

  drivers = signal<Driver[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  teamFilter = new FormControl('');
  teamFilterSignal = signal<string>('');

  teams = computed(() => 
    [...new Set(this.drivers().map(driver => driver.team_name))].sort()
  );
  filteredDrivers = computed(() => {
    const selectedTeam = (this.teamFilterSignal() ?? '').toLowerCase();
    const allDrivers = this.drivers();

    if (!selectedTeam) return allDrivers;

    return allDrivers.filter(driver => (driver.team_name ?? '').toLowerCase().includes(selectedTeam));
  });

  ngOnInit() {
    this.teamFilter.valueChanges.subscribe(value => {
      this.teamFilterSignal.set(value ?? '');
    });
    this.teamFilterSignal.set(this.teamFilter.value ?? '');
    
    this.loadDrivers();
  };

  private loadDrivers() {
    this.f1ApiService.getDrivers().subscribe({
      next: (data) => {
        const enrichedDrivers: Driver[] = data.map(driver => ({
          ...driver,
          country_code: this.countryService.getCountryCode(driver.driver_number)
        }));
        this.drivers.set(enrichedDrivers);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar pilotos: ', error);
        this.error.set('Erro ao carregar pilotos.');
        this.isLoading.set(false);
      }
    });
  };

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/driver-placeholder.jpg';
  };

  getFallbackImageUrl(driver: string): string {
    if (driver === 'Kimi ANTONELLI') {
      const firstName = 'Andrea';
      const [secondName, lastName] = driver.split(' ');
      const initials = firstName.slice(0, 3).toUpperCase() +
      lastName.slice(0, 3).toUpperCase();
      const folder = firstName.charAt(0);
      const fileName = `${firstName.slice(0, 3).toLowerCase()}${lastName.slice(0, 3).toLowerCase()}01.png`

      return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${folder}/${initials}01_${firstName}%20${secondName}_${lastName}/${fileName}`;
    }

    const [firstName, lastName] = driver.split(' ');
    const initials = firstName.slice(0, 3).toUpperCase() +
    lastName.slice(0, 3).toUpperCase();
    const folder = firstName.charAt(0);
    const fileName = `${firstName.slice(0, 3).toLowerCase()}${lastName.slice(0, 3).toLowerCase()}01.png`

    return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${folder}/${initials}01_${firstName}_${lastName}/${fileName}`;
  };

  onFavoriteToggled(event: { id: number; type: 'driver' | 'race'; isFavorite: boolean }): void {
    console.log(`Piloto ${event.id} ${event.isFavorite ? 'favoritado' : 'desfavoritado'}`);
  };
}
