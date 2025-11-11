import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  template: `
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" routerLink="/">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="3500.000000pt"
              height="875.000000pt"
              viewBox="0 0 3500.000000 875.000000"
              preserveAspectRatio="xMidYMid meet"
            >

              <g transform="translate(0.000000,875.000000) scale(0.100000,-0.100000)"
              fill="#e10600" stroke="none">
              <path d="M12785 8739 c-1612 -35 -2692 -188 -3568 -505 -944 -342 -1755 -895
              -2924 -1996 -240 -225 -4822 -4769 -5933 -5882 l-355 -356 2465 0 2465 1 340
              332 c682 665 2166 2102 3050 2952 330 318 776 741 925 877 721 663 1261 969
              1996 1132 395 87 767 129 1504 168 155 8 1976 12 6500 15 l6286 4 1634 1634
              1635 1635 -7835 -2 c-4309 -1 -7992 -5 -8185 -9z"/>
              <path d="M25360 4375 l-4375 -4375 2630 0 2630 0 4375 4375 4375 4375 -2630 0
              -2630 0 -4375 -4375z"/>
              <path d="M13391 4929 c-1976 -39 -2706 -245 -3598 -1013 -209 -180 -423 -391
              -2193 -2155 l-1765 -1760 2295 -1 2294 0 671 668 c691 689 772 762 981 893
              298 188 566 261 1139 311 94 8 1328 12 4430 15 l4301 4 1524 1524 1525 1525
              -5615 -2 c-3088 -1 -5783 -5 -5989 -9z"/>
              <path d="M28480 1010 l0 -80 170 0 170 0 0 -465 0 -465 95 0 95 0 0 465 0 465
              175 0 175 0 0 80 0 80 -440 0 -440 0 0 -80z"/>
              <path d="M29480 545 l0 -545 90 0 90 0 0 422 c0 250 4 418 9 413 5 -6 75 -196
              156 -422 l148 -413 78 0 c75 0 77 1 87 28 5 15 71 197 146 406 75 208 141 386
              146 395 6 10 9 -132 10 -406 l0 -423 90 0 90 0 0 545 0 545 -134 0 -134 0 -10
              -27 c-5 -16 -69 -203 -142 -418 -73 -214 -136 -394 -140 -398 -4 -4 -74 182
              -156 415 l-149 423 -138 3 -137 3 0 -546z"/>
              </g>
            </svg>
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
            <a class="navbar-item" routerLink="/blog" routerLinkActivate="is-active">
              Blog
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
