import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateUpdateEmailPage } from './candidate-update-email.page';

describe('CandidateUpdateEmailPage', () => {
  let component: CandidateUpdateEmailPage;
  let fixture: ComponentFixture<CandidateUpdateEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateUpdateEmailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateUpdateEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
