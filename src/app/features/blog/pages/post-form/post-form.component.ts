import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BlogService } from '../../../../core/services/blog.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { firstValueFrom } from 'rxjs';
import { BlogPost } from '../../../../shared/interfaces/blog-post';

function uniqueTitleValidator(blogService: BlogService, getCurrentId: () => string | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const title = control.get('title')?.value;
    const raceKey = control.get('raceSessionKey')?.value;

    if (!title || !raceKey) return null;

    const exists = blogService.existsTitleInRace(title, raceKey, getCurrentId() ?? undefined);

    return exists ? { titleExists: true } : null;
  };
};

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a routerLink="/blog" class="has-text-warning">Blog</a></li>
            <li class="is-active">
              <a aria-current="page">{{ isEditMode() ? 'Editar Post' : 'Novo Post' }}</a>
            </li>
          </ul>
        </nav>

        <h1 class="title has-text-warning">
          {{ isEditMode() ? 'Editar Post' : 'Criar Novo Post' }}
        </h1>

        <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="box f1-card">
          <!-- Título -->
          <div class="field">
            <label class="label has-text-white" for="title">Título</label>
            <div class="control">
              <input 
                id="title"
                class="input" 
                type="text" 
                formControlName="title"
                placeholder="Ex: Análise da Corrida no Bahrain..."
                [class.is-danger]="title.invalid && title.touched"
                [class.is-success]="title.valid && title.touched"
              >
            </div>
            @if (title.invalid && title.touched) {
              <p class="help is-danger">
                @if (title.errors?.['required']) { Título é obrigatório }
                @if (title.errors?.['minlength']) { Mínimo 5 caracteres }
                @if (title.errors?.['maxLength']) { Máximo 100 caracteres }
              </p>
            }
            @if (postForm.errors?.['titleExists'] && postForm.dirty) {
              <p class="help is-danger">Título já existe para essa corrida</p>
            }
          </div>

          <!-- Corrida Relacionada -->
          <div class="field">
            <label class="label has-text-white" for="raceSelect">Corrida Relacionada</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select id="raceSelect" formControlName="raceSessionKey"
                  [class.is-danger]="raceSessionKey.invalid && raceSessionKey.touched"
                  [class.is-success]="raceSessionKey.valid && raceSessionKey.touched">
                  <option value="">Selecione uma corrida</option>
                  @for (race of races(); track race.session_key) {
                    <option [value]="race.session_key">
                      {{ race.circuit_short_name }} - {{ race.date_start | date:'dd/MM/yyyy' }}
                    </option>
                  }
                </select>
              </div>
            </div>
            @if (raceSessionKey.invalid && raceSessionKey.touched) {
              <p class="help is-danger">Selecione uma corrida</p>
            }
          </div>

          <!-- Conteúdo -->
          <div class="field">
            <label class="label has-text-white" for="content">Conteúdo</label>
            <div class="control">
              <textarea 
                id="content"
                class="textarea" 
                formControlName="content"
                rows="10"
                placeholder="Escreva sua análise da corrida..."
                [class.is-danger]="content.invalid && content.touched"
                [class.is-success]="content.valid && content.touched"
              ></textarea>
            </div>
            @if (content.invalid && content.touched) {
              <p class="help is-danger">
                @if (content.errors?.['required']) { Conteúdo é obrigatório }
                @if (content.errors?.['minlength']) { Mínimo 50 caracteres }
              </p>
            }
            <p class="help has-text-light">
              {{ content.value?.length || 0 }} / 50 caracteres mínimos
            </p>
          </div>

          <!-- Autor -->
          <div class="field">
            <label class="label has-text-white" for="author">Autor</label>
            <div class="control">
              <input
                id="author" 
                class="input" 
                type="text" 
                formControlName="author"
                placeholder="Seu nome"
                [class.is-danger]="author.invalid && author.touched"
              >
            </div>
            @if (author.invalid && author.touched) {
              <p class="help is-danger">Autor é obrigatório</p>
            }
          </div>

          <!-- Actions -->
          <div class="field is-grouped">
            <div class="control">
              <button 
                type="submit" 
                class="button is-warning"
                [disabled]="postForm.invalid || isLoading()"
              >
                {{ isEditMode() ? 'Atualizar' : 'Criar' }} Post
              </button>
            </div>
            <div class="control">
              <button type="button" class="button is-light" routerLink="/blog">
                Cancelar
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="notification is-danger mt-4">
              {{ error() }}
            </div>
          }
        </form>
      </div>
    </section>
  `,
  styles: [`
    .f1-card {
      background: linear-gradient(135deg, #1f1f27 0%, #15151e 100%);
      border: 1px solid #333;
    }
    .textarea {
      min-height: 200px;
      resize: vertical;
    }
  `]
})
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private f1ApiService = inject(F1ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  races = signal<any[]>([]);
  isEditMode = signal<boolean>(false);
  currentPostId = signal<string | null>(null);

  postForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
    raceSessionKey: ['', [Validators.required]],
    author: ['', [Validators.required]]
  }, { validators: [] });

  ngOnInit() {
    this.postForm
      .setValidators(uniqueTitleValidator(this.blogService, () => this.currentPostId()));
    
    this.loadRace();
    this.checkEditMode();
  }

  private async loadRace() {
    try {
      const sessions = await firstValueFrom(this.f1ApiService.getSessions());

      this.races.set(sessions.filter((session: any) => session.session_type === 'Race'));
    } catch (error) {
      console.error(error);
      this.error.set('Erro ao carregar corridas');
    }
  }

  private checkEditMode() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.isEditMode.set(true);
      this.currentPostId.set(postId);

      const post = this.blogService.getPost(postId);
      if (post) this.postForm.patchValue({
        title: post.title,
        content: post.content,
        raceSessionKey: post.raceSessionKey,
        author: post.author
      });
      else this.error.set('Post não encontrado');
    };
  };

  onSubmit() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    try {
      const raw = this.postForm.value;
      const payload: Omit<BlogPost, 'id' | 'createdAt'> = {
        title: raw.title!,
        content: raw.content!,
        raceSessionKey: raw.raceSessionKey!,
        author: raw.author!
      };

      if (this.isEditMode()) {
        this.blogService.updatePost(this.currentPostId()!, payload);
      } else {
        this.blogService.createPost(payload);
      };

      this.router.navigate(['/blog']);
    } catch (error) {
      console.error(error);
      this.error.set('Erro ao salvar post');
    } finally {
      this.isLoading.set(false);
    };
  }

  markAllAsTouched() {
    Object.keys(this.postForm.controls).forEach(key => {
      this.postForm.get(key)?.markAsTouched();
    });
  };

  get title() { return this.postForm.get('title')!; }
  get content() { return this.postForm.get('content')!; }
  get raceSessionKey() { return this.postForm.get('raceSessionKey')!; }
  get author() { return this.postForm.get('author')!; }
}
