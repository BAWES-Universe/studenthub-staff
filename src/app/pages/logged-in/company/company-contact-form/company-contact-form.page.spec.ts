import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyContactFormPage } from './company-contact-form.page';

describe('CompanyContactFormPage', () => {
  let component: CompanyContactFormPage;
  let fixture: ComponentFixture<CompanyContactFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyContactFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyContactFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
