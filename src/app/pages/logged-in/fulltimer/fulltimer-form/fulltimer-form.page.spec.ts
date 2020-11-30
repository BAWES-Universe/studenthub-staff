import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulltimerFormPage } from './fulltimer-form.page';

describe('FulltimerFormPage', () => {
  let component: FulltimerFormPage;
  let fixture: ComponentFixture<FulltimerFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulltimerFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulltimerFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
