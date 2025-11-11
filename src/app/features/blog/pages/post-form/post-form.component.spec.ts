import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFormComponent } from './post-form.component';
import { of } from 'rxjs';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../../../core/services/blog.service';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

const mockF1ApiService = {
  getSessions: jest.fn().mockReturnValue(of([
    { session_key: '100', session_type: 'Race', circuit_short_name: 'GP', date_start: '2025-03-10T00:00:00Z' }
  ]))
};

describe('PostFormComponent - Validations', () => {
  const mockBlogService = {
    existsTitleInRace: jest.fn().mockReturnValue(false),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    getPost: jest.fn()
  };

  beforeEach(async () => {
    await render(PostFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: F1ApiService, useValue: mockF1ApiService }
      ]
    });
  });

  it('should show required errors when fields are touched and empty', async () => {
    fireEvent.blur(screen.getByLabelText(/Título/i));
    expect(await screen.findByText(/Título é obrigatório/i)).toBeInTheDocument();

    fireEvent.blur(screen.getByLabelText(/Conteúdo/i));
    expect(await screen.findByText(/Conteúdo é obrigatório/i)).toBeInTheDocument();

    fireEvent.blur(screen.getByLabelText(/Autor/i));
    expect(await screen.findByText(/Autor é obrigatório/i)).toBeInTheDocument();
  });

  it('should validate title minlength', async () => {
    const title = screen.getByLabelText(/Título/i);

    fireEvent.input(title, { target: { value: 'abc' } });
    fireEvent.blur(title);
    expect(await screen.findByText(/Mínimo 5 caracteres/i)).toBeInTheDocument();
  });

  it('should display race options loaded form F1ApiService', async () => {
    expect(await screen.findByText(/GP/i)).toBeInTheDocument();
  });

  it('should display titleExists error when uniqueTitleValidator triggers', async () => {
    (mockBlogService.existsTitleInRace as jest.Mock).mockReturnValue(true);
    const title = screen.getByLabelText(/Título/i);
    fireEvent.input(title, { target: { value: 'Duplicado' } });

    const raceSelect = screen.getByLabelText(/Corrida Relacionada/i);
    fireEvent.change(raceSelect, { target: { value: '100' } });

    fireEvent.blur(title);
    fireEvent.blur(raceSelect);

    expect(await screen.findByText(/Título já existe para essa corrida/i)).toBeInTheDocument();
  });
});

describe('PostFormComponent - Submissions', () => {
  const mockBlogService = {
    existsTitleInRace: jest.fn().mockReturnValue(false),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    getPost: jest.fn()
  };

  it('should create new post in create mode', async () => {
    const { fixture } = await render(PostFormComponent, {
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: F1ApiService, useValue: mockF1ApiService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    });

    const comp = fixture.componentInstance;
    comp.postForm.patchValue({
      title: 'Novo Post',
      content: 'Conteúdo válido com mais de cinquenta caracteres para passar na validação.',
      raceSessionKey: '100',
      author: 'Test Author'
    });
    comp.onSubmit();

    expect(mockBlogService.createPost).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Novo Post',
        content: expect.any(String),
        raceSessionKey: '100',
        author: 'Test Author'
      })
    );
  });

  it('should update post in edit mode and navigate back', async () => {
    const mockPost  = { id: 123, title: 'Existente', content: 'x'.repeat(60), raceSessionKey: '100', author: 'a', createdAt: new Date() };
    mockBlogService.getPost.mockReturnValue(mockPost);

    const { fixture } = await render(PostFormComponent, {
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: F1ApiService, useValue: mockF1ApiService },
        { provide: ActivatedRoute, useValue: { snapshot: {
          paramMap: { get: (key: string) => key === 'id' ? '123' : null }
        } } }
      ]
    });

    const comp = fixture.componentInstance;
    const router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');
    comp.onSubmit();


    expect(mockBlogService.updatePost).toHaveBeenCalledWith('123', expect.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/blog']);
  });
});
