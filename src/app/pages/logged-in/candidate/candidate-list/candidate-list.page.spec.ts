import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateListPage } from './candidate-list.page';

describe('CandidateListPage', () => {
  let component: CandidateListPage;
  let fixture: ComponentFixture<CandidateListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
