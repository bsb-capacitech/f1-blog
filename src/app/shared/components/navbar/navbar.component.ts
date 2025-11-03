import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  template: `
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item has-text-weight-bold has-text-warning" routerLink="/">
            🏎️ F1 BLOG
          </a>
        </div>

        <div class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" routerLink="/races" routerLinkActivate="is-active" aria-current="page">
              Corridas
            </a>
            <a class="navbar-item" routerLink="/drivers" routerLinkActivate="is-active">
              Pilotos
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-item.is-active {
      background: #e10600 !important;
      color: white !important;
    }
  `]
})
export class NavbarComponent {

}
