import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyContactListPage } from './company-contact-list.page';

describe('CompanyContactListPage', () => {
  let component: CompanyContactListPage;
  let fixture: ComponentFixture<CompanyContactListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyContactListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyContactListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
