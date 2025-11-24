import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FavoritesService, FavoriteType } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-favorite-heart',
  imports: [CommonModule, FaIconComponent],
  template: `
    <button
      class="button is-ghost favorite-btn"
      (click)="onToggle()"
      [class.is-favorite]="isFavorite()"
      [attr.aria-pressed]="isFavorite()"
      [attr.aria-label]="isFavorite() ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
    >
      <span class="icon is-small">
        @if (isFavorite()) {
          <fa-icon [icon]="'heart'" class="has-text-danger" aria-hidden="true" />
        } @else {
          <fa-icon [icon]="'heart'" class="has-text-grey-light" aria-hidden="true" />
        }
      </span>
    </button>
  `,
  styles: [`
    .favorite-btn {
      transition: all 0.3s ease;
      border: none;
      background: transparent;
      
      &:hover {
        transform: scale(1.08);
        transition: transform .15s;
      }
      
      &.is-favorite {
        animation: pulse .45s ease;
      }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
  `]
})
export class FavoriteHeartComponent {
  private favoritesService = inject(FavoritesService);

  itemId = input.required<number>();
  type = input.required<FavoriteType>();

  favoriteToggled = output<{ id: number; type: FavoriteType; isFavorite: boolean }>();

  isFavorite = computed(() => {
    const id = this.itemId();

    return this.type() === 'driver'
      ? this.favoritesService.isDriverFavorites(id)()
      : this.favoritesService.isRaceFavorites(id)();
  });

  onToggle(): void {
    const id = this.itemId();
    const type = this.type();

    if (type === 'driver') this.favoritesService.toggleDriver(id);
    else this.favoritesService.toggleRace(id);

    this.favoriteToggled.emit({
      id,
      type,
      isFavorite: this.isFavorite()
    });
  }
}
