import { fireEvent, render, screen } from '@testing-library/angular';
import { NavbarComponent } from './navbar.component';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('NavbarComponent', () => {
  it('should render navbar with links', async () => {
    await render(NavbarComponent, {
      providers: [
        provideRouter([
          { path: 'races', component: DummyComponent },
          { path: 'drivers', component: DummyComponent }
        ])
      ]
    });

    expect(screen.getByText('Corridas')).toBeInTheDocument();
    expect(screen.getByText('Pilotos')).toBeInTheDocument();
  });

  it('should navigate when clicking on links', async () => {
    const { fixture } = await render(NavbarComponent, {
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'races', component: DummyComponent },
          { path: 'drivers', component: DummyComponent }
        ])
      ]
    });

    const router = fixture.debugElement.injector.get(Router);

    fireEvent.click(screen.getByText('Pilotos'));
    await fixture.whenStable();

    expect(router.url).toBe('/drivers');
  });
});
