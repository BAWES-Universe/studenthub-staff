import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyContactViewPage } from './company-contact-view.page';

describe('CompanyContactViewPage', () => {
  let component: CompanyContactViewPage;
  let fixture: ComponentFixture<CompanyContactViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyContactViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyContactViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
