import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitationListPage } from './invitation-list.page';

describe('InvitationListPage', () => {
  let component: InvitationListPage;
  let fixture: ComponentFixture<InvitationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
