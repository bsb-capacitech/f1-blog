import { fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let storageMock: Record<string, string>;
  let setSpy: jest.SpyInstance;
  const STORAGE_KEY = 'f1-favorites';

  beforeEach(() => {
    storageMock = {};
    
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => storageMock[key] || null);
    setSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined);
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {delete storageMock[key] });

    TestBed.configureTestingModule({
      providers: [FavoritesService]
    });
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('should initialize with empty favorites arrays', () => {
    expect(service.favoriteDrivers()).toEqual([]);
    expect(service.favoriteRaces()).toEqual([]);
  });

  it('should add and remove favorites correctly (toogle)', () => {
    service.toggleDriver(33);
    expect(service.favoriteDrivers()).toContain(33);

    service.toggleDriver(33);
    expect(service.favoriteDrivers()).not.toContain(33);
  });

  it('should automatically persist bookmarks in localStorage', fakeAsync (() => {
    service.toggleRace(101);
    (service as any).persist$.next((service as any).state());
    
    tick(300);
    flushMicrotasks();
    flush();

    expect(setSpy).toHaveBeenCalledTimes(1);

    const payload = setSpy.mock.calls[0][1];
    expect(payload).toContain('101');
  }));

  it('should rehydrate state from localStorage', () => {
    storageMock[STORAGE_KEY] = JSON.stringify({ drivers: [44], races: [201] });
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [FavoritesService]
    });
    service = TestBed.inject(FavoritesService);

    expect(service.favoriteDrivers()).toContain(44);
    expect(service.favoriteRaces()).toContain(201);
  });
});
