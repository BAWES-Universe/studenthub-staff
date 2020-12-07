import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateMergeSelectPage } from './candidate-merge-select.page';

describe('CandidateMergeSelectPage', () => {
  let component: CandidateMergeSelectPage;
  let fixture: ComponentFixture<CandidateMergeSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateMergeSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateMergeSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
