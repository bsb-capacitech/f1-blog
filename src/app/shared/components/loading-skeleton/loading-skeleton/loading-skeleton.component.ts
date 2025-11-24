import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [class]="type()" role="skeleton">
      @if (type() === 'card') {
        <div class="card fi-card is-loading">
          <div class="card-image">
            <div class="skeleton-image"></div>
          </div>
          <div class="card-content">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line long"></div>
          </div>
        </div>
      }
      @else if (type() === 'table') {
        <div class="table-skeleton">
          @for (row of [1,2,3,4,5]; track row) {
            <div class="skeleton-row">
              @for (col of [1,2,3,4,5,6]; track col) {
                <div class="skeleton-cell" [class]="'width-' + col"></div>
              }
            </div>
          }
        </div>
      }
      @else if (type() === 'text') {
        <div class="text-skeleton">
          <div class="skeleton-line" [class]="size()"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-container {
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    .is-loading {
      opacity: 0.7;
    }
    
    .skeleton-image {
      width: 100%;
      height: 120px;
      background: linear-gradient(90deg, #2a2a3a 25%, #3a3a4a 50%, #2a2a3a 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    
    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, #2a2a3a 25%, #3a3a4a 50%, #2a2a3a 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 8px;
      
      &.short {
        width: 60%;
      }
      
      &.medium {
        width: 80%;
      }
      
      &.long {
        width: 100%;
      }
      
      &.title {
        height: 20px;
        margin-bottom: 12px;
      }
      
      &.subtitle {
        height: 16px;
        margin-bottom: 10px;
      }
    }
    
    .table-skeleton {
      width: 100%;
    }
    
    .skeleton-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .skeleton-cell {
      height: 20px;
      background: linear-gradient(90deg, #2a2a3a 25%, #3a3a4a 50%, #2a2a3a 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      flex: 1;
      
      &.width-1 { flex: 0.5; }
      &.width-2 { flex: 1; }
      &.width-3 { flex: 1.5; }
      &.width-4 { flex: 2; }
      &.width-5 { flex: 1; }
      &.width-6 { flex: 0.8; }
    }
    
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `]
})
export class LoadingSkeletonComponent {
  type = input<'card' | 'table' | 'text'>('card');
  size = input<'short' | 'medium' | 'long' | 'title' | 'subtitle'>('medium');
}
