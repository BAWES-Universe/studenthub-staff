import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateFilterPage } from './candidate-filter.page';

describe('CandidateFilterPage', () => {
  let component: CandidateFilterPage;
  let fixture: ComponentFixture<CandidateFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateFilterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
