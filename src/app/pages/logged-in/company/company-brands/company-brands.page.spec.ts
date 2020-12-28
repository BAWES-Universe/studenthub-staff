import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyBrandsPage } from './company-brands.page';

describe('CompanyBrandsPage', () => {
  let component: CompanyBrandsPage;
  let fixture: ComponentFixture<CompanyBrandsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBrandsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyBrandsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
