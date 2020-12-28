import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanySubcompaniesPage } from './company-subcompanies.page';

describe('CompanySubcompaniesPage', () => {
  let component: CompanySubcompaniesPage;
  let fixture: ComponentFixture<CompanySubcompaniesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySubcompaniesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanySubcompaniesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
