import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-drivers-list',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <h1 class="title has-text-warning">Pilotos da F1</h1>
        <p class="has-text-white">Em desenvolvimento - próxima aula!</p>
        <a routerLink="/races" class="button is-warning mt4"><- Voltar para Corridas</a>
      </div>
    </section>
  `,
  styleUrl: './drivers-list.component.scss'
})
export class DriversListComponent {

}
