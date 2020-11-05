import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateNoteFormPage } from './candidate-note-form.page';

describe('CandidateNoteFormPage', () => {
  let component: CandidateNoteFormPage;
  let fixture: ComponentFixture<CandidateNoteFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateNoteFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateNoteFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
