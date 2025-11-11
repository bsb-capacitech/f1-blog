import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsListComponent } from './posts-list.component';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BlogService } from '../../../../core/services/blog.service';
import { F1ApiService } from '../../../../core/services/f1-api.service';
import { createMockPost } from '../../../../shared/helpers/tests/test-utils';

describe('PostsListComponent', () => {
  const mockF1ApiService = {
    getSessions: jest.fn().mockReturnValue(of([
      { session_key: '100', session_type: 'Race', circuit_short_name: 'GP' }
    ]))
  };

  const mockPosts = [
    createMockPost({ title: 'A' , raceSessionKey: '100' }),
    createMockPost({ title: 'B', raceSessionKey: '200' })
  ];

  const mockBlogService = {
    posts: signal(mockPosts),
    sortedPosts: signal(mockPosts),
    deletePost: jest.fn(),
    getPost: jest.fn()
  };

  it('should display all posts by default', async () => {
    await render(PostsListComponent, {
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BlogService, useValue: mockBlogService },
        { provide: F1ApiService, useValue: mockF1ApiService }
      ]
    });

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should filter posts by selectedRaceFilter', async () => {
    const { fixture } = await render(PostsListComponent, {
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BlogService, useValue: mockBlogService }
      ]
    });
    const comp = fixture.componentInstance;

    comp.selectedRaceFilter.set('100');
    fixture.detectChanges();

    expect(comp.filteredPosts().length).toBe(1);
    // expect(comp.filteredPosts()[0].raceSessioKey).toBe('100');
    expect(comp.filteredPosts()[0].raceSessionKey).toBe('100');
  });

  it('should open confirmation modal and delete when confirmed', async () => {
    const { fixture } = await render(PostsListComponent, {
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BlogService, useValue: mockBlogService }
      ]
    });

    const comp = fixture.componentInstance;
    comp.confirmDelete(mockPosts[0]);
    expect(comp.showDeleteModal()).toBe(true);

    comp.deletePost();

    expect(mockBlogService.deletePost).toHaveBeenCalledWith(mockPosts[0].id);
    expect(comp.showDeleteModal()).toBe(false);
  });
});
