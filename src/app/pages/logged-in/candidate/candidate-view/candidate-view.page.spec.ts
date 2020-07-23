import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateViewPage } from './candidate-view.page';

describe('CandidateViewPage', () => {
  let component: CandidateViewPage;
  let fixture: ComponentFixture<CandidateViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
