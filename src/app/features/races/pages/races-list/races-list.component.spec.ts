import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RacesListComponent } from './races-list.component';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { RaceCountryService } from './race-country.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MOCK_SESSIONS } from '../../../../core/services/__mocks__/session-data.mock';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RacesListComponent', () => {
  let component: RacesListComponent;
  let fixture: ComponentFixture<RacesListComponent>;

  const mockF1ApiService = {
    getSessions: jest.fn().mockReturnValue({
      subscribe: (obs: any) => obs.next(MOCK_SESSIONS.filter(session => session.session_type === 'Race'))
    })
  };

  const mockRaceCountryService = {
    getCountryService: jest.fn().mockReturnValue('BRA')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacesListComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: F1ApiService, useValue: mockF1ApiService },
        { provide: RaceCountryService, useValue: mockRaceCountryService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the page title and filter label', () => {
    expect(fixture.nativeElement.textContent).toContain('Calendário de Corridas F1');
    expect(fixture.nativeElement.textContent).toContain('Filtrar por temporada');
  });

  it('should show loading state initially', () => {
    component.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Carregando corridas...');
  });

  it('should filter races when seasonFilter changes', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = '2024';
    select.dispatchEvent(new Event('change'));    
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.title.is-4');
    expect(cards.length).toBeGreaterThan(0);
  });
});
