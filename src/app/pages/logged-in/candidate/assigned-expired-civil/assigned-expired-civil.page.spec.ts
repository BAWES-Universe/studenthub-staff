import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignedExpiredCivilPage } from './assigned-expired-civil.page';

describe('AssignedExpiredCivilPage', () => {
  let component: AssignedExpiredCivilPage;
  let fixture: ComponentFixture<AssignedExpiredCivilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedExpiredCivilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignedExpiredCivilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
