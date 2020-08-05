import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateSearchPage } from './candidate-search.page';

describe('CandidateSearchPage', () => {
  let component: CandidateSearchPage;
  let fixture: ComponentFixture<CandidateSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
