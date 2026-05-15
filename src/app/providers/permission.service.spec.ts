import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PermissionService } from './permission.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PermissionService', () => {
  let service: PermissionService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [PermissionService, AuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(PermissionService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch permissions from the API', () => {
    const mockPermissions = [
      {
        permission_user_uuid: 'per_user0ebb6ca9-6861-11f0-adb6-261c1d1147ff',
        admin_id: null,
        staff_id: 2,
        permission_sub_section_uuid: 'per_sb_sec377a5291-4ecb-11ed-b0cc-0af11b562340',
        created_at: '2025-07-24 07:37:31',
        companies: [1, 2, 3, 4]
      }
    ];

    authService.staff_id = 2;

    service.loadPermissions().subscribe(permissions => {
      expect(permissions.length).toBe(1);
      expect(permissions[0].id).toBe('per_sb_sec377a5291-4ecb-11ed-b0cc-0af11b562340');
    });

    const req = httpMock.expectOne(`${environment.apiEndpoint}/permission-section/user-permission/staff/2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPermissions);
  });
});
