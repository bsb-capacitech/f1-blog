import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Driver, F1ApiService } from '../../../../core/services/f1-api.service';
import { firstValueFrom } from 'rxjs';
import { CountryFlagPipe } from '../../../../shared/pipes/country-flag.pipe';
import { DriverCountryService } from '../../../drivers/pages/drivers-list/driver-country.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-driver-compare',
  imports: [CommonModule, ReactiveFormsModule, CountryFlagPipe, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title has-text-warning has-text-centered">Comparador de Pilotos</h1>
        
        @if (!isLoading()) {
          <div class="tags">
            @for (driver of drivers(); track driver.driver_number) {
              <span class="tag is-info is-clickable" (click)="addDriver(driver.driver_number)" [class.is-light]="isDriverSelected(driver.driver_number)">
                {{ driver.full_name }}
              </span>
            }
          </div>
        } @else {
          <p>Carregando pilotos...</p>
        }

        <!-- Badges selecionados -->
        <div class="mt-4">
          @for (driverNum of selectedDriverNumbers(); track driverNum) {
            <span class="tag is-warning is-medium mr-2">
            {{ getDriverName(driverNum) }}
              <button class="delete is-small ml-2" (click)="removeDriver(driverNum)"></button>
            </span>
          }
        </div>

        <!-- Botão limpar -->
        @if (selectedDriverNumbers().length > 0) {
          <button class="button is-danger mt-3" (click)="clearAll()">Limpar Seleção</button>
        }

        <!-- Cards de Comparação -->
        @if (comparisonData().length > 0) {
          <div class="columns is-variable is-8 mt-5">
            @for (data of comparisonData(); track data.driver_number) {
              <div class="column is-half">
                <div class="card f1-card">
                  <header class="card-header has-background-dark">
                    <p class="card-header-title has-text-warning">
                      {{ data.country_code | countryFlag }} 
                      {{ data.full_name }}
                    </p>
                  </header>
                  <div class="card-content">
                    <table class="table is-bordered is-fullwidth has-text-white">
                      <tbody>
                        <tr><td><strong>Equipe</strong></td><td>{{ data.team_name }}</td></tr>
                        <tr><td><strong>Pontos</strong></td><td class="has-text-warning">{{ data.points }}</td></tr>
                        <tr><td><strong>Vitórias</strong></td><td>{{ data.wins }}</td></tr>
                        <tr><td><strong>Poles</strong></td><td>{{ data.poles }}</td></tr>
                        <tr><td><strong>Pódios</strong></td><td>{{ data.podiums }}</td></tr>
                        <tr><td><strong>Posição média</strong></td><td>{{ data.avg_finish }}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @if (comparisonData().length === 2) {
          <div class="section">
            <div class="box chart-container">
              <h2 class="title is-4 has-text-warning has-text-centered mb-5">Comparação Visual</h2>
              <div class="chart-wrapper">
                <canvas 
                  baseChart
                  [type]="barChartType"
                  [data]="barChartData"
                  [options]="barChartOptions">
                </canvas>
              </div>
            </div>
          </div>
        <!-- } @else if (comparisonData().length === 1) { -->
        } @else if (selectedDriverNumbers().length === 1) {
          <div class="notification is-info is-light mt-5 has-text-centered">
            Selecione mais um piloto para ver a comparação completa! 🏎️
          </div>
        } @else {
          <p class="has-text-grey-light">Selecione dois pilotos para comparar.</p>
        }
      </div>
    </section>
  `,
  styles: [`
    .f1-card {
      background: linear-gradient(135deg, #1f1f27 0%, #15151e 100%);
      border: 1px solid #333;
    }
    .f1-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(225, 6, 0, 0.3);
    }
    .table {
      background: transparent;
    }
    .table td {
      background: rgba(255, 255, 255, 0.05);
      border-color: #333;
    }
    .chart-wrapper {
      position: relative;
      height: 400px;
      width: 100%;
    }
    .chart-container {
      background: linear-gradient(135deg, #1f1f27 0%, #15151e 100%);
      border: 1px solid #e10600;
      border-radius: 8px;
      padding: 2rem;
    }
    @media (max-width: 768px) {
      .columns.is-variable.is-8 {
        margin: 0;
      }
      .column.is-half {
        padding: 0.5rem;
      }
      .chart-wrapper {
        height: 300px;
      }
    }
  `]
})
export class DriverCompareComponent {
  private f1ApiService = inject(F1ApiService);
  private countryService = inject(DriverCountryService);

  drivers = signal<Driver[]>([]);
  comparisonData = signal<any[]>([]);
  selectedDriverNumbers = signal<number[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public barChartType = 'bar' as const;
  barChartData: ChartData<'bar'> = {
    labels: ['Pontos', 'Vitórias', 'Poles', 'Pódios'],
    datasets: []
  }
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#fff',
          font: { size: 14 }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffd700',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          font: { size: 12 }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        border: { display: false }
      },
      y: {
        ticks: {
          color: '#fff',
          font: { size: 12 }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        border: { display: false }
      }
    }
  };

  constructor() {
    this.loadDrivers();
    this.setupComparisonEffect();
  };

  private async loadDrivers() {
    try {
      const data = await firstValueFrom(this.f1ApiService.getDrivers());
      this.drivers.set(data);
    } catch (error) {
      this.error.set('Erro ao carregar pilotos.');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  };

  addDriver(driverNumber: number) {
    const current = this.selectedDriverNumbers();

    if (current.includes(driverNumber)) return;
    if (current.length >= 2) return;

    this.selectedDriverNumbers.set([...current, driverNumber]);
  };

  removeDriver(driverNumber: number) {
    const current = this.selectedDriverNumbers();
    this.selectedDriverNumbers.set(current.filter(dn => dn !== driverNumber));
  };

  clearAll() {
    this.selectedDriverNumbers.set([]);
    this.comparisonData.set([]);
  };

  isDriverSelected(driverNumber: number): boolean {
    return this.selectedDriverNumbers().includes(driverNumber);
  };

  getDriverName(driverNumber: number): string {
    const driver = this.drivers().find(driver => driver.driver_number === driverNumber);
    return driver?.full_name || `Piloto #${driverNumber}`;
  };

  setupComparisonEffect() {
    effect(() => {
      const selected = this.selectedDriverNumbers();

      if (selected.length > 0) this.loadComparisonData(selected);
      else {
        this.comparisonData.set([]);
        this.clearChart();
      };
    });
  };

  loadComparisonData(selectedIds: number[]) {
    const selectedDrivers = this.drivers().filter(driver => selectedIds.includes(driver.driver_number));

    const comparisonResults = selectedDrivers.map(driver => this.mapDriverToComparison(driver));

    this.comparisonData.set(comparisonResults);

    if (comparisonResults.length === 2) this.updateChart();
  };

  mapDriverToComparison(driver: Driver) {
    const basePoints = Math.floor(Math.random() * 150) + 50;

    return {
      driver_number: driver.driver_number,
      full_name: driver.full_name,
      team_name: driver.team_name,
      points: basePoints,
      wins: Math.floor(basePoints / 25),
      poles: Math.floor(Math.random() * 5),
      podiums: Math.floor(basePoints / 15),
      avg_finish: Math.floor(Math.random() * 8 + 3).toFixed(1),
      country_code: this.countryService.getCountryCode(driver.driver_number)
    };
  };

  updateChart() {
    const data = this.comparisonData();
    if (data.length !== 2) return;

    this.barChartData.datasets = data.map((data, index) => ({
      label: data.full_name,
      data: [data.points, data.wins, data.poles, data.podiums],
      backgroundColor: this.randomColor(),
      borderWidth: 2,
      borderRadius: 4
    }));

    this.chart?.update();
  };

  clearChart() {
    this.barChartData.datasets = [];
    this.chart?.update();
  }

  randomColor() {
    const colors = ['#fd4bc7', '#3273dc', '#01c00e', '#ffdd57', '#f47600', '#00d7b6', '#ed1131'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
}
