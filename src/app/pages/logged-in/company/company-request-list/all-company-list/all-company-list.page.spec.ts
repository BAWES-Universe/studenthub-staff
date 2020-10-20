import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllCompanyListPage } from './all-company-list.page';

describe('AllCompanyListPage', () => {
  let component: AllCompanyListPage;
  let fixture: ComponentFixture<AllCompanyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCompanyListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllCompanyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
