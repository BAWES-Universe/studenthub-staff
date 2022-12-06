import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateAssignFormPage } from './candidate-assign-form.page';

describe('CandidateAssignFormPage', () => {
  let component: CandidateAssignFormPage;
  let fixture: ComponentFixture<CandidateAssignFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAssignFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateAssignFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
