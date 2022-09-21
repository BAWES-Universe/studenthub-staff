import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogHourListPage } from './invitation.page';

describe('LogHourListPage', () => {
  let component: LogHourListPage;
  let fixture: ComponentFixture<LogHourListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogHourListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogHourListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
