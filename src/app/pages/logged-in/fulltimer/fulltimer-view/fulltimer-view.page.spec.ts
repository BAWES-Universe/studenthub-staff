import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulltimerViewPage } from './fulltimer-view.page';

describe('FulltimerViewPage', () => {
  let component: FulltimerViewPage;
  let fixture: ComponentFixture<FulltimerViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulltimerViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulltimerViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
