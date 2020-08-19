import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateReviewListPage } from './candidate-review-list.page';

describe('CandidateReviewListPage', () => {
  let component: CandidateReviewListPage;
  let fixture: ComponentFixture<CandidateReviewListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateReviewListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateReviewListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
