import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyContactRolePage } from './company-contact-role.page';

describe('CompanyContactRolePage', () => {
  let component: CompanyContactRolePage;
  let fixture: ComponentFixture<CompanyContactRolePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyContactRolePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyContactRolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
