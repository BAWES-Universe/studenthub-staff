import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyRequestListPage } from './company-request-list.page';

describe('CompanyRequestListPage', () => {
  let component: CompanyRequestListPage;
  let fixture: ComponentFixture<CompanyRequestListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRequestListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRequestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
