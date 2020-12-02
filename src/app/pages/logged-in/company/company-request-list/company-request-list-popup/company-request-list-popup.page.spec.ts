import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyRequestListPopupPage } from './company-request-list-popup.page';

describe('CompanyRequestListPopupPage', () => {
  let component: CompanyRequestListPopupPage;
  let fixture: ComponentFixture<CompanyRequestListPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRequestListPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRequestListPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
