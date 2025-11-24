import { computed, effect, Injectable, signal } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

export type FavoriteType = 'driver' | 'race';

export interface FavoriteState {
  drivers: number[]; // driver_numbers
  races: number[]; // session_keys
};

const STORAGE_KEY = 'f1-favorites';
const PERSIST_DEBOUNCE_MS = 300;

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private state = signal<FavoriteState>(this.loadFromStorage());

  private persist$ = new Subject<FavoriteState>();

  favoriteDrivers = computed(() => this.state().drivers);
  favoriteRaces = computed(() => this.state().races);
  isDriverFavorites = (driverId: number) => computed(() => this.favoriteDrivers().includes(driverId));
  isRaceFavorites = (raceId: number) => computed(() => this.favoriteRaces().includes(raceId));

  constructor() {
    effect(() => this.persist$.next(this.state()));

    this.persist$
      .pipe(debounceTime(PERSIST_DEBOUNCE_MS))
      .subscribe(state => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
          console.error();          
        }
      });
  };

  toggleDriver(driverId: number): void {
    this.state.update(state => {
      const drivers = state.drivers.includes(driverId)
        ? state.drivers.filter(id => id !== driverId)
        : [...state.drivers, driverId];

      return { ...state, drivers };
    });
  };

  toggleRace(raceId: number): void {
    this.state.update(state => {
      const races = state.races.includes(raceId)
        ? state.races.filter(id => id !== raceId)
        : [...state.races, raceId];

      return { ...state, races };
    });
  };

  addToFavorites(id: number, type: FavoriteType): void {
    this.state.update(state => {
      const key = type === 'driver' ? 'drivers' : 'races';
      const list = (state as any)[key] as number[];

      if (list.includes(id)) return state;
      return { ...state, [key]: [...list, id] };
    });
  };

  removeFromFavorites(id: number, type: FavoriteType): void {
    this.state.update(state => {
      const key = type === 'driver' ? 'drivers' : 'races';
      return { ...state, [key]: ((state as any)[key] as number[]).filter(x => x !== id) };
    });
  };

  private loadFromStorage(): FavoriteState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { drivers: [], races: [] };
    } catch {
      return { drivers: [], races: [] };
    }
  };

  clearAll(): void {
    this.state.set({ drivers: [], races: [] });
  };
}
