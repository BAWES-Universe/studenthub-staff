import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyRequestDashboardPage } from './company-request-dashboard.page';

describe('CompanyRequestDashboardPage', () => {
  let component: CompanyRequestDashboardPage;
  let fixture: ComponentFixture<CompanyRequestDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRequestDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRequestDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
