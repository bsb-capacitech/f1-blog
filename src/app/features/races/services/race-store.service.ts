import { Injectable, signal } from '@angular/core';
import { Session } from '../../../core/services/f1-api.service';

@Injectable({
  providedIn: 'root'
})
export class RaceStoreService {
  selectedRace = signal<Session | null>(null);

  setRace(race: Session) {
    this.selectedRace.set(race);
  }

  clear() {
    this.selectedRace.set(null);
  }
}
