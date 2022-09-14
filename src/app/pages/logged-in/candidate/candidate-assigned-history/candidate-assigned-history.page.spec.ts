import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateAssignedHistoryPage } from './candidate-list.page';

describe('CandidateAssignedHistoryPage', () => {
  let component: CandidateAssignedHistoryPage;
  let fixture: ComponentFixture<CandidateAssignedHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAssignedHistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateAssignedHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
