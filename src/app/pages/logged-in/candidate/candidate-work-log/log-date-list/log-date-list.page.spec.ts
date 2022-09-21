import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogDateListPage } from './invitation.page';

describe('LogDateListPage', () => {
  let component: LogDateListPage;
  let fixture: ComponentFixture<LogDateListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDateListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogDateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
