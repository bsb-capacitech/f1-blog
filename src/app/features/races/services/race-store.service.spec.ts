import { TestBed } from '@angular/core/testing';

import { RaceStoreService } from './race-store.service';
import { Session } from '../../../core/services/f1-api.service';

describe('RaceStoreService', () => {
  let service: RaceStoreService;
  const mockRace: Session = {
    session_key: 12345,
    meeting_key: 100,
    session_name: 'Spanish Grand Prix',
    session_type: 'Race',
    date_start: '2024-06-23T15:00:00Z',
    country_name: 'Spain',
    country_code: 'ESP',
    country_key: 1,
    circuit_short_name: 'Barcelona'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceStoreService]
    });
    service = TestBed.inject(RaceStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve selected race', () => {
    service.setRace(mockRace);
    const retrievedRace = service.selectedRace();

    expect(retrievedRace).toEqual(mockRace);
  });

  it('should return undefined initially', () => {
    expect(service.selectedRace()).toBeNull();
  });

  it('should substitute stored race', () => {
    const secondRace: Session = {
      ...mockRace,
      session_key: 67890,
      session_name: 'Monaco Grand Prix'
    }

    service.setRace(mockRace);
    service.setRace(secondRace);

    expect(service.selectedRace()?.session_key).toBe(67890);
    expect(service.selectedRace()?.session_name).toBe('Monaco Grand Prix');
  });
});

describe('RaceStoreService (integration)', () => {
  let service: RaceStoreService;
  const race: Session = {
    session_key: 10,
    meeting_key: 99,
    session_name: 'Austrian GP',
    session_type: 'Race',
    date_start: '2025-07-14T10:00:00Z',
    country_name: 'Austria',
    country_code: 'AUT',
    country_key: 17,
    circuit_short_name: 'Red Bull Ring'
  }

  beforeEach(() => {
    service = new RaceStoreService();
  });

  it('should persist and clear run correctly', () => {
    service.setRace(race);

    expect(service.selectedRace()?.session_name).toBe('Austrian GP');

    service.clear();
    expect(service.selectedRace()).toBeNull();
  });
});
