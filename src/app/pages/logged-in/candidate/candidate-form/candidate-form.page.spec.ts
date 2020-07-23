import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateFormPage } from './candidate-form.page';

describe('CandidateFormPage', () => {
  let component: CandidateFormPage;
  let fixture: ComponentFixture<CandidateFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
