import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyFormPage } from './company-form.page';

describe('CompanyFormPage', () => {
  let component: CompanyFormPage;
  let fixture: ComponentFixture<CompanyFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
