import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyListPage } from './company-list.page';

describe('CompanyListPage', () => {
  let component: CompanyListPage;
  let fixture: ComponentFixture<CompanyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
