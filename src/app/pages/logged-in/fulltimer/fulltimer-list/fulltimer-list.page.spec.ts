import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulltimerListPage } from './fulltimer-list.page';

describe('FulltimerListPage', () => {
  let component: FulltimerListPage;
  let fixture: ComponentFixture<FulltimerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulltimerListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulltimerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
