import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateSuggestionsPage } from './candidate-suggestions.page';

describe('CandidateSuggestionsPage', () => {
  let component: CandidateSuggestionsPage;
  let fixture: ComponentFixture<CandidateSuggestionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateSuggestionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateSuggestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
