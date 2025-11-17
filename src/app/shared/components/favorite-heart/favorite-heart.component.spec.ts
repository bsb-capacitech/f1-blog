
import { FavoriteHeartComponent } from './favorite-heart.component';
import { Component } from '@angular/core';
import { fireEvent, render, screen } from '@testing-library/angular';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'host-test',
  standalone: true,
  imports: [FavoriteHeartComponent],
  template: `
    <app-favorite-heart
      [itemId]="itemId"
      [type]="type"
      (favoriteToggled)="onToggle($event)"
    ></app-favorite-heart>
  `,
})
class HostComponent {
  itemId = 33;
  type: any = 'driver';
  outputSpy = jest.fn();

  onToggle(e: any) {
    this.outputSpy(e);
  }
}

describe('FavoriteHeartComponent', () => {
  it('should render button and toggle class and aria-pressed on click', async () => {
    const { fixture } = await render(FavoriteHeartComponent, {
      providers: [FavoritesService],
      inputs: {
        itemId: 33,
        type: 'driver'
      }
    });

    const heart = screen.getByRole('button', { name: /adicionar aos favoritos/i });
    expect(heart).toHaveAttribute('aria-pressed', 'false');
    expect(heart.classList.contains('is-favorite')).toBe(false);

    fireEvent.click(heart);
    fixture.detectChanges();

    expect(heart).toHaveAttribute('aria-pressed', 'true');
    expect(heart.classList.contains('is-favorite')).toBe(true);
  });

  it('should emit favoriteToggled event with the correct payload', async () => {
    const { fixture } = await render(HostComponent, {
      providers: [FavoritesService]
    });

    const host = fixture.componentInstance;
    const heart = screen.getByRole('button', { name: /adicionar aos favoritos/i });

    fireEvent.click(heart);
    fixture.detectChanges();

    expect(host.outputSpy).toHaveBeenCalledWith({ id: 33, type: 'driver', isFavorite: true });
  });

  it('should update ARIA accessibility attributes', async () => {
    const { fixture } = await render(FavoriteHeartComponent, {
      providers: [FavoritesService],
      inputs: {
        itemId: 44,
        type: 'driver'
      }
    });

    const heart = screen.getByRole('button');
    expect(heart).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(heart);
    fixture.detectChanges();

    expect(heart).toHaveAttribute('aria-pressed', 'true');
  });
});
