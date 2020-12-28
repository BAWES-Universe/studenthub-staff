import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulltimerNotesPage } from './fulltimer-notes.page';

describe('FulltimerNotesPage', () => {
  let component: FulltimerNotesPage;
  let fixture: ComponentFixture<FulltimerNotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulltimerNotesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulltimerNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
