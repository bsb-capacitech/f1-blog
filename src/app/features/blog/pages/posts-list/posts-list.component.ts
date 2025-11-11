import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../../core/services/blog.service';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { BlogPost } from '../../../../shared/interfaces/blog-post';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <h1 class="title has-text-warning">Blog F1</h1>
          </div>
          <div class="level-right">
            <a class="button is-warning" routerLink="/blog/new">
              <span class="icon">✏️</span>
              <span>Novo Post</span>
            </a>
          </div>
        </div>

        <!-- Filtro por Corrida -->
        <div class="field">
          <label class="label has-text-white">Filtrar por Corrida:</label>
          <div class="control">
            <div class="select">
              <select [value]="selectedRaceFilter()" (change)="onRaceFilterChange($event)">
                <option value="">Todas as corridas</option>
                @for (race of availableRaces(); track race.session_key) {
                  <option [value]="race.session_key">
                    {{ race.circuit_short_name }}
                  </option>
                }
              </select>
            </div>
          </div>
        </div>

        <!-- Lista de Posts -->
        @if (filteredPosts().length === 0) {
          <div class="has-text-centered py-6">
            <p class="title is-4 has-text-white">Nenhum post encontrado</p>
            <p class="has-text-light">Comece criando seu primeiro post sobre F1!</p>
            <a class="button is-warning mt-4" routerLink="/blog/new">
              Criar Primeiro Post
            </a>
          </div>
        } @else {
          <div class="columns is-multiline">
            @for (post of filteredPosts(); track post.id) {
              <div class="column is-one-third">
                <div class="card f1-card">
                  <div class="card-content">
                    <p class="title is-5 has-text-warning mb-2">
                      {{ post.title }}
                    </p>
                    
                    <p class="has-text-light mb-3">
                      <small>
                        Por <strong>{{ post.author }}</strong> em 
                        {{ post.createdAt | date:'dd/MM/yyyy' }}
                      </small>
                    </p>

                    <p class="has-text-light mb-4">
                      {{ (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content) }}
                    </p>

                    <div class="tags">
                      <span class="tag is-info is-light">
                        {{ getRaceName(post.raceSessionKey) }}
                      </span>
                    </div>
                  </div>

                  <footer class="card-footer">
                    <a class="card-footer-item has-text-info" [routerLink]="['/blog/edit', post.id]">
                      Editar
                    </a>
                    <a class="card-footer-item has-text-danger" (click)="confirmDelete(post)">
                      Excluir
                    </a>
                  </footer>
                </div>
              </div>
            }
          </div>
        }

        <!-- Modal de Confirmação -->
        @if (showDeleteModal()) {
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title has-text-white">Confirmar Exclusão</p>
              </header>
              <section class="modal-card-body">
                <p class="has-text-white">
                  Tem certeza que deseja excluir o post "{{ postToDelete()?.title }}"?
                </p>
                <p class="has-text-light is-size-7 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </section>
              <footer class="modal-card-foot">
                <button class="button is-danger" (click)="deletePost()">Excluir</button>
                <button class="button is-light" (click)="cancelDelete()">Cancelar</button>
              </footer>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .f1-card {
      background: linear-gradient(135deg, #1f1f27 0%, #15151e 100%);
      border: 1px solid #333;
      transition: transform 0.2s ease;
    }
    .f1-card:hover {
      transform: translateY(-2px);
      border-color: #e10600;
    }
    .card-footer-item {
      border-color: #333 !important;
    }
  `]
})
export class PostsListComponent {
  private blogService = inject(BlogService);
  private f1ApiService = inject(F1ApiService);

  selectedRaceFilter = signal<string>('');
  showDeleteModal = signal<boolean>(false);
  postToDelete = signal<BlogPost | null>(null);
  races = signal<any[]>([]);

  filteredPosts = computed(() => {
    const filter = this.selectedRaceFilter();
    const posts = this.blogService.sortedPosts();
    
    return filter ? posts.filter(posts => posts.raceSessionKey === filter) : posts;
  });
  availableRaces = computed(() => {
    const posts = this.blogService.sortedPosts();
    const raceKeys = Array.from(new Set(posts.map(post => post.raceSessionKey)));

    return raceKeys.map(key => {
      const race = this.races().find(race => race.session_key.toString() === key);
      return race || { session_key: key, circuit_short_name: 'Corrida Desconhecida' };
    });
  });

  constructor() {
    this.loadRaces();
  };

  private async loadRaces() {
    try {
      const sessions = await firstValueFrom(this.f1ApiService.getSessions());
      this.races.set(sessions.filter((session: any) => session.session_type === 'Race'));
    } catch (error) {
      console.error(error);
    };
  };

  onRaceFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedRaceFilter.set(target.value);
  };

  // CRUD Methods
  getRaceName(sessionKey: string): string {
    const race = this.races().find(race => race.session_key.toString() === sessionKey);
    return race?.circuit_short_name || 'Corrida Desconhecida';
  };

  confirmDelete(post: BlogPost) {
    this.postToDelete.set(post);
    this.showDeleteModal.set(true);
  };

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.postToDelete.set(null);
  };

  deletePost() {
    const post = this.postToDelete();
    if (post) {
      this.blogService.deletePost(post.id);
      this.cancelDelete();
    }
  };
}
