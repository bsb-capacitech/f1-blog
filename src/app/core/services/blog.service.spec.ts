import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create a new post and persist to storage', () => {
    const payload = {
      title: 'Novo Post',
      content: 'Conteúdo do novo post com texto suficiente...',
      raceSessionKey: '300',
      author: 'Test Author'
    };
    service.createPost(payload);

    const posts = service.posts();

    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe(payload.title);
    expect(posts[0].id).toBeDefined();
    expect(posts[0].createdAt).toBeInstanceOf(Date);

    const raw = JSON.parse(localStorage.getItem('f1-blog-posts') || '[]');
    // expect(raw.lenght).toBe(1);
    expect(raw.length).toBe(1);
    expect(raw[0].title).toBe(payload.title);
  });

  it('should update an existing post', () => {
    service.createPost({
      title: 'Original',
      content: 'Conteúdo original',
      raceSessionKey: '100',
      author: 'Author'
    });
    const post = service.posts()[0];

    service.updatePost(post.id, { title: 'Atualizado' });

    const updated = service.getPost(post.id);

    // expect(updated.title).toBe('Atualizado');
    expect(updated!.title).toBe('Atualizado');
  });

  it('existsTitleInRace should detect duplicates (case-insensitive)', () => {
    service.createPost({
      title: 'Meu Título',
      content: 'c',
      raceSessionKey: '55',
      author: 'a'
    });
    expect(service.existsTitleInRace('meu título', '55')).toBeTruthy();

    const id = service.posts()[0].id;
    expect(service.existsTitleInRace('meu título', '55', id)).toBeFalsy();
  });
});
