import { computed, Injectable, signal } from '@angular/core';
import { BlogPost } from '../../shared/interfaces/blog-post';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly STORAGE_KEY = 'f1-blog-posts';

  private _posts = signal<BlogPost[]>(this.loadFromStorage());

  posts = computed(() => this._posts());
  sortedPosts = computed(() =>
  [...this._posts()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  private loadFromStorage(): BlogPost[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);

      if (!stored) return [];

      const parsed = JSON.parse(stored) as any[];
      return parsed.map(parse => ({ ...parse, createdAt: new Date(parse.createdAt) }));
    } catch {
      return [];
    }
  };

  private saveToStorage(posts: BlogPost[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
  };

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // @ts-ignore
      return crypto.randomUUID();
    }

    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  // CRUD Operations
  createPost(post: Omit<BlogPost, 'id' | 'createdAt'>): void {
    const newPost: BlogPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date()
    }

    this._posts.update(posts => {
      const updated = [...posts, newPost];
      this.saveToStorage(updated);
      return updated;
    });
  };

  updatePost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): void {
    this._posts.update(posts => { 
      const updated = posts.map(post => 
        post.id === id ? { ...post, ...updates } : post
      );

      this.saveToStorage(updated);
      return updated;
    });
  };

  deletePost(id: string): void {
    this._posts.update(posts => {
      const updated = posts.filter(post => post.id !== id);

      this.saveToStorage(updated);
      return updated;
    });
  };

  getPost(id: string): BlogPost | undefined {
    return this._posts().find(post => post.id === id);
  }

  existsTitleInRace(title: string, raceSessionKey: string, excludeId?: string) {
    const t = title.trim().toLowerCase();

    return this._posts().some(post =>
      post.raceSessionKey === raceSessionKey &&
      post.title.trim().toLowerCase() === t &&
      post.id !== excludeId
    );
  }
}
