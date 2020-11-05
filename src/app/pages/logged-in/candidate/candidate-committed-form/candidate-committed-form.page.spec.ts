import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateCommittedFormPage } from './candidate-committed-form.page';

describe('CandidateCommittedFormPage', () => {
  let component: CandidateCommittedFormPage;
  let fixture: ComponentFixture<CandidateCommittedFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateCommittedFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCommittedFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
