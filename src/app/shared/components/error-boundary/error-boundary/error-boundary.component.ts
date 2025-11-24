import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-boundary',
  imports: [CommonModule],
  template: `
    <div class="error-boundary notification is-danger">
      <div class="content has-text-centered">
        <p class="title is-5 has-text-white">
          <span class="icon">⚠️</span>
          Algo deu errado
        </p>
        
        <p class="has-text-light mb-3">{{ message() }}</p>
        
        <div class="buttons is-centered">
          <button class="button is-warning" (click)="onRetry.emit()">
            Tentar Novamente
          </button>
          <button class="button is-light" (click)="onGoHome.emit()">
            Ir para Início
          </button>
        </div>
        
        @if (showDetails()) {
          <details class="mt-3">
            <summary class="has-text-light is-size-7">Detalhes técnicos</summary>
            <pre class="has-text-light is-size-7 mt-2"><code>{{ errorDetails() }}</code></pre>
          </details>
        }
      </div>
    </div>
  `,
  styles: [`
    .error-boundary {
      border: 1px solid #e10600;
      background: linear-gradient(135deg, #2a1a1a 0%, #15151e 100%);
    }
    
    details {
      border: 1px solid #444;
      border-radius: 4px;
      padding: 8px;
      
      summary {
        cursor: pointer;
        outline: none;
      }
      
      pre {
        background: #1a1a1a;
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
      }
    }
  `]
})
export class ErrorBoundaryComponent {
  message = input('Ocorreu um erro inesperado');
  errorDetails = input<string>('');
  showDetails = input(false);

  onRetry = output<void>();
  onGoHome = output<void>();
}
