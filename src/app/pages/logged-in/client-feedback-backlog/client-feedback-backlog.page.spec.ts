import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientFeedbackBacklogPage } from './client-feedback-backlog.page';

describe('ClientFeedbackBacklogPage', () => {
  let component: ClientFeedbackBacklogPage;
  let fixture: ComponentFixture<ClientFeedbackBacklogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFeedbackBacklogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFeedbackBacklogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
