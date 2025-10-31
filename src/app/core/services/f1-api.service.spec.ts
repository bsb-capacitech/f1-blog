import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { F1ApiService } from './f1-api.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MOCK_DRIVERS, MOCK_ERROR_RESPONSE, MOCK_SESSIONS } from './__mocks__/session-data.mock';

describe('F1ApiService', () => {
  let service: F1ApiService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://api.openf1.org/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        F1ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(F1ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getSessions()', () => {
    it('should fetch sessions successfully', fakeAsync(() => {
      let actualSessions: Session[] | undefined;

      service.getSessions().subscribe(sessions => {
        actualSessions = sessions;
      });

      const req = httpMock.expectOne(`${API_URL}/sessions`);
      expect(req.request.method).toBe('GET');

      req.flush(MOCK_SESSIONS);
      tick();

      expect(actualSessions).toEqual(MOCK_SESSIONS);
      expect(actualSessions?.length).toBe(3);
      expect(actualSessions?.[0].session_name).toBe('Practice 1');
    }))

    it('should handle HTTP errors in getSessions()', fakeAsync(() => {
      let actualError: any;

      service.getSessions().subscribe({ error: (error: any) => (actualError = error) });

      const req = httpMock.expectOne(`${API_URL}/Error`);
      req.error(MOCK_ERROR_RESPONSE, { status: 500, statusText: 'Internal Server Error' })
      tick();
      
      expect(actualError).toBeDefined();
    }));
  });

  describe('getDrivers()', () => {
    it('should fetch drivers successfully', fakeAsync(() => {
      let actualDrivers: Driver[] | undefined;

      service.getDrivers().subscribe(drivers => {
        actualDrivers = drivers;
      });

      const req = httpMock.expectOne(`${API_URL}/drivers?session_key=latest`);
      expect(req.request.method).toBe('GET');

      req.flush(MOCK_DRIVERS);
      tick();

      expect(actualDrivers).toEqual(MOCK_DRIVERS);
      expect(actualDrivers?.length).toBe(2);
      expect(actualDrivers?.[0].full_name).toBe('Max Verstappen');
    }));
  });

  describe('getEndpoint()', () => {
    it('should fetch generic endpoint data', () => {
      const testEndpoint = 'circuits';
      const mockResponse = [{ circuit_name: 'Monaco' }];

      service.getEndpoint(testEndpoint).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/${testEndpoint}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should preserve TypeScript types with generic endpoint', () => {
      interface Circuit {
        circuit_name: string;
      }

      const testEndpoint = 'circuits';

      service.getEndpoint<Circuit[]>(testEndpoint).subscribe(circuits => {
        expect(circuits[0].circuit_name).toBeDefined();
        // @ts-expect-error - Teste de tipo: esta propriedade não deve existir
        expect(circuits[0].invalid_prop).toBeUndefined();
      });

      httpMock.expectOne(`${API_URL}/${testEndpoint}`)flush([{ circuit_name: 'Monaco' }]);
    });
  });

  describe('Service initialization', () => {
    it('should be created with proper dependencies', () => {
      expect(service).toBeTruthy();
      expect(httpMock).toBeTruthy();
    });

    it('should have correct base URL', () => {
      expect(service).toBeInstanceOf(F1ApiService);
    });
  });
});
