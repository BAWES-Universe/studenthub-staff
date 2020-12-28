import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyContactsPage } from './company-contacts.page';

describe('CompanyContactsPage', () => {
  let component: CompanyContactsPage;
  let fixture: ComponentFixture<CompanyContactsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyContactsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
