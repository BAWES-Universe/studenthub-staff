import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyNoteFormPage } from './company-note-form.page';

describe('CompanyNoteFormPage', () => {
  let component: CompanyNoteFormPage;
  let fixture: ComponentFixture<CompanyNoteFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNoteFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyNoteFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
