import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyFilterPage } from './company-filter.page';

describe('CompanyFilterPage', () => {
  let component: CompanyFilterPage;
  let fixture: ComponentFixture<CompanyFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFilterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
