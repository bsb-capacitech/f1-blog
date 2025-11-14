import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { F1ApiService } from "./f1-api.service";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";

describe('F1ApiService (error scenarios)', () => {
  let service: F1ApiService;
  let httpMock: HttpTestingController;
  const originalError = console.error;

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

    jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const msg = String(args[0] ?? '');
      if (msg.includes('Erro so buscar sessões')) return;
      originalError(...args);
    });
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should handle network error with appropriate fallback', () => {
    let erroCapturado: any;
    service.getSessions().subscribe({ error: err => (erroCapturado = err) });

    const req = httpMock.expectOne('https://api.openf1.org/v1/sessions');
    req.error(new ProgressEvent('Network error'));

    expect(erroCapturado).toBeDefined();
  })
});