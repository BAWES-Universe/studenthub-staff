import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoryViewPage } from './story-view.page';

describe('StoryViewPage', () => {
  let component: StoryViewPage;
  let fixture: ComponentFixture<StoryViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
