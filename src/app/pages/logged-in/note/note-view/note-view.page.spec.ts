import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoteViewPage } from './note-view.page';

describe('NoteViewPage', () => {
  let component: NoteViewPage;
  let fixture: ComponentFixture<NoteViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
