import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignedIdleCandidatesPage } from './assigned-idle-candidates.page';

describe('AssignedIdleCandidatesPage', () => {
  let component: AssignedIdleCandidatesPage;
  let fixture: ComponentFixture<AssignedIdleCandidatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedIdleCandidatesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignedIdleCandidatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
