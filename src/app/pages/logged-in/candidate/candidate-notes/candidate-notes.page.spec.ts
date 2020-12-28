import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateNotesPage } from './candidate-notes.page';

describe('CandidateNotesPage', () => {
  let component: CandidateNotesPage;
  let fixture: ComponentFixture<CandidateNotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateNotesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
