import { TestBed } from '@angular/core/testing';

import { DriversListComponent } from './drivers-list.component';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

describe('DriversListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversListComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
      ],
    })
    .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DriversListComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
