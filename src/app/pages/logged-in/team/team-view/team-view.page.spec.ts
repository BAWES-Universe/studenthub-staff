import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamViewPage } from './team-view.page';

describe('TeamViewPage', () => {
  let component: TeamViewPage;
  let fixture: ComponentFixture<TeamViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
